const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'agroplay.db');
let db = null;

// Initialize database
const initDatabase = async () => {
    const SQL = await initSqlJs();

    // Try to load existing database
    try {
        if (fs.existsSync(dbPath)) {
            const fileBuffer = fs.readFileSync(dbPath);
            db = new SQL.Database(fileBuffer);
            console.log('[SQLite] Loaded existing database from:', dbPath);
        } else {
            db = new SQL.Database();
            console.log('[SQLite] Created new database');
        }
    } catch (error) {
        console.log('[SQLite] Creating new database');
        db = new SQL.Database();
    }

    // Create tables
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      role TEXT DEFAULT 'Farmer',
      points INTEGER DEFAULT 1250,
      eco_points INTEGER DEFAULT 0,
      badges TEXT DEFAULT '[]',
      location TEXT DEFAULT 'India',
      soil_type TEXT DEFAULT 'Alluvial Soil',
      farm_size TEXT DEFAULT '0',
      crop_preferences TEXT DEFAULT '[]',
      sustainability_goals TEXT DEFAULT '[]',
      irrigation_preference TEXT DEFAULT 'Drip Irrigation',
      language_preference TEXT DEFAULT 'English',
      onboarding_complete INTEGER DEFAULT 0,
      avatar TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      user_uid TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT NOT NULL
    )
  `);

    // User activities table - stores all user progress and activities
    db.run(`
    CREATE TABLE IF NOT EXISTS user_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_uid TEXT NOT NULL,
      activity_type TEXT NOT NULL,
      activity_key TEXT NOT NULL,
      activity_data TEXT DEFAULT '{}',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_uid, activity_type, activity_key)
    )
  `);

    // User journeys table - stores cultivation journeys
    db.run(`
    CREATE TABLE IF NOT EXISTS user_journeys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_uid TEXT NOT NULL,
      journey_id TEXT UNIQUE NOT NULL,
      crop_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      current_step_index INTEGER DEFAULT 0,
      steps_data TEXT DEFAULT '[]',
      health_score INTEGER DEFAULT 100,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Save to file
    saveDatabase();

    console.log('[SQLite] Database initialized successfully');
    return db;
};

// Save database to file
const saveDatabase = () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
};

// Get database instance
const getDb = () => db;

// User operations
const userDb = {
    // Create a new user
    create: (userData) => {
        const stmt = db.prepare(`
      INSERT INTO users (uid, name, email, password, phone, role, points, eco_points, badges, 
        location, soil_type, farm_size, crop_preferences, sustainability_goals, 
        irrigation_preference, language_preference, onboarding_complete, avatar, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        stmt.run([
            userData.uid,
            userData.name,
            userData.email,
            userData.password,
            userData.phone || '',
            userData.role || 'Farmer',
            userData.points || 1250,
            userData.ecoPoints || 0,
            JSON.stringify(userData.badges || []),
            userData.location || 'India',
            userData.soilType || 'Alluvial Soil',
            userData.farmSize || '0',
            JSON.stringify(userData.cropPreferences || []),
            JSON.stringify(userData.sustainabilityGoals || []),
            userData.irrigationPreference || 'Drip Irrigation',
            userData.languagePreference || 'English',
            userData.onboardingComplete ? 1 : 0,
            userData.avatar || null,
            userData.createdAt || new Date().toISOString()
        ]);
        stmt.free();
        saveDatabase();
        return true;
    },

    // Find user by email
    findByEmail: (email) => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        stmt.bind([email]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return mapRowToUser(row);
        }
        stmt.free();
        return null;
    },

    // Find user by UID
    findByUid: (uid) => {
        const stmt = db.prepare('SELECT * FROM users WHERE uid = ?');
        stmt.bind([uid]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return mapRowToUser(row);
        }
        stmt.free();
        return null;
    },

    // Update user
    update: (uid, updates) => {
        const allowedFields = {
            name: 'name',
            phone: 'phone',
            role: 'role',
            points: 'points',
            ecoPoints: 'eco_points',
            badges: 'badges',
            location: 'location',
            soilType: 'soil_type',
            farmSize: 'farm_size',
            cropPreferences: 'crop_preferences',
            sustainabilityGoals: 'sustainability_goals',
            irrigationPreference: 'irrigation_preference',
            languagePreference: 'language_preference',
            onboardingComplete: 'onboarding_complete',
            avatar: 'avatar'
        };

        const setClauses = [];
        const values = [];

        Object.keys(updates).forEach(key => {
            if (allowedFields[key]) {
                setClauses.push(`${allowedFields[key]} = ?`);
                let value = updates[key];

                // Handle JSON fields
                if (['badges', 'cropPreferences', 'sustainabilityGoals'].includes(key)) {
                    value = JSON.stringify(value);
                }
                // Handle boolean
                if (key === 'onboardingComplete') {
                    value = value ? 1 : 0;
                }

                values.push(value);
            }
        });

        if (setClauses.length === 0) return null;

        values.push(uid);
        db.run(`UPDATE users SET ${setClauses.join(', ')} WHERE uid = ?`, values);
        saveDatabase();

        return userDb.findByUid(uid);
    }
};

// Refresh token operations
const tokenDb = {
    // Save refresh token
    save: (token, userUid, expiresAt) => {
        const stmt = db.prepare(`
      INSERT INTO refresh_tokens (token, user_uid, expires_at)
      VALUES (?, ?, ?)
    `);
        stmt.run([token, userUid, expiresAt]);
        stmt.free();
        saveDatabase();
        return true;
    },

    // Find refresh token
    find: (token) => {
        const stmt = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?');
        stmt.bind([token]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return row;
        }
        stmt.free();
        return null;
    },

    // Delete refresh token
    delete: (token) => {
        db.run('DELETE FROM refresh_tokens WHERE token = ?', [token]);
        saveDatabase();
        return true;
    },

    // Delete all tokens for user
    deleteAllForUser: (userUid) => {
        db.run('DELETE FROM refresh_tokens WHERE user_uid = ?', [userUid]);
        saveDatabase();
        return true;
    },

    // Clean expired tokens
    cleanExpired: () => {
        db.run('DELETE FROM refresh_tokens WHERE expires_at < ?', [new Date().toISOString()]);
        saveDatabase();
        return true;
    }
};

// Map database row to user object
function mapRowToUser(row) {
    return {
        uid: row.uid,
        name: row.name,
        email: row.email,
        password: row.password,
        phone: row.phone,
        role: row.role,
        points: row.points,
        ecoPoints: row.eco_points,
        badges: JSON.parse(row.badges || '[]'),
        location: row.location,
        soilType: row.soil_type,
        farmSize: row.farm_size,
        cropPreferences: JSON.parse(row.crop_preferences || '[]'),
        sustainabilityGoals: JSON.parse(row.sustainability_goals || '[]'),
        irrigationPreference: row.irrigation_preference,
        languagePreference: row.language_preference,
        onboardingComplete: row.onboarding_complete === 1,
        avatar: row.avatar,
        createdAt: row.created_at
    };
}

// Activity operations - for tracking user progress across app sections
const activityDb = {
    // Save or update an activity
    save: (userUid, activityType, activityKey, activityData) => {
        const now = new Date().toISOString();
        const dataStr = JSON.stringify(activityData);

        // Try to update first
        db.run(`
            INSERT INTO user_activities (user_uid, activity_type, activity_key, activity_data, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_uid, activity_type, activity_key) 
            DO UPDATE SET activity_data = ?, updated_at = ?
        `, [userUid, activityType, activityKey, dataStr, now, now, dataStr, now]);

        saveDatabase();
        return true;
    },

    // Get a specific activity
    get: (userUid, activityType, activityKey) => {
        const stmt = db.prepare('SELECT * FROM user_activities WHERE user_uid = ? AND activity_type = ? AND activity_key = ?');
        stmt.bind([userUid, activityType, activityKey]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return {
                ...row,
                activity_data: JSON.parse(row.activity_data || '{}')
            };
        }
        stmt.free();
        return null;
    },

    // Get all activities of a type for user
    getByType: (userUid, activityType) => {
        const results = [];
        const stmt = db.prepare('SELECT * FROM user_activities WHERE user_uid = ? AND activity_type = ? ORDER BY updated_at DESC');
        stmt.bind([userUid, activityType]);
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push({
                ...row,
                activity_data: JSON.parse(row.activity_data || '{}')
            });
        }
        stmt.free();
        return results;
    },

    // Get all activities for user
    getAllForUser: (userUid) => {
        const results = [];
        const stmt = db.prepare('SELECT * FROM user_activities WHERE user_uid = ? ORDER BY updated_at DESC');
        stmt.bind([userUid]);
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push({
                ...row,
                activity_data: JSON.parse(row.activity_data || '{}')
            });
        }
        stmt.free();
        return results;
    },

    // Delete an activity
    delete: (userUid, activityType, activityKey) => {
        db.run('DELETE FROM user_activities WHERE user_uid = ? AND activity_type = ? AND activity_key = ?',
            [userUid, activityType, activityKey]);
        saveDatabase();
        return true;
    }
};

// Journey operations - for cultivation journeys
const journeyDb = {
    // Create a new journey
    create: (userUid, journeyData) => {
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO user_journeys (user_uid, journey_id, crop_id, crop_name, start_date, status, 
                current_step_index, steps_data, health_score, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run([
            userUid,
            journeyData.id,
            journeyData.cropId,
            journeyData.cropName,
            journeyData.startDate || now,
            journeyData.status || 'active',
            journeyData.currentStepIndex || 0,
            JSON.stringify(journeyData.steps || []),
            journeyData.healthScore || 100,
            now,
            now
        ]);
        stmt.free();
        saveDatabase();
        return true;
    },

    // Get journey by ID
    getById: (journeyId) => {
        const stmt = db.prepare('SELECT * FROM user_journeys WHERE journey_id = ?');
        stmt.bind([journeyId]);
        if (stmt.step()) {
            const row = stmt.getAsObject();
            stmt.free();
            return mapRowToJourney(row);
        }
        stmt.free();
        return null;
    },

    // Get all journeys for user
    getAllForUser: (userUid) => {
        const results = [];
        const stmt = db.prepare('SELECT * FROM user_journeys WHERE user_uid = ? ORDER BY updated_at DESC');
        stmt.bind([userUid]);
        while (stmt.step()) {
            const row = stmt.getAsObject();
            results.push(mapRowToJourney(row));
        }
        stmt.free();
        return results;
    },

    // Update journey
    update: (journeyId, updates) => {
        const now = new Date().toISOString();
        const setClauses = ['updated_at = ?'];
        const values = [now];

        if (updates.status !== undefined) {
            setClauses.push('status = ?');
            values.push(updates.status);
        }
        if (updates.currentStepIndex !== undefined) {
            setClauses.push('current_step_index = ?');
            values.push(updates.currentStepIndex);
        }
        if (updates.steps !== undefined) {
            setClauses.push('steps_data = ?');
            values.push(JSON.stringify(updates.steps));
        }
        if (updates.healthScore !== undefined) {
            setClauses.push('health_score = ?');
            values.push(updates.healthScore);
        }

        values.push(journeyId);
        db.run(`UPDATE user_journeys SET ${setClauses.join(', ')} WHERE journey_id = ?`, values);
        saveDatabase();

        return journeyDb.getById(journeyId);
    },

    // Delete journey
    delete: (journeyId) => {
        db.run('DELETE FROM user_journeys WHERE journey_id = ?', [journeyId]);
        saveDatabase();
        return true;
    }
};

// Map journey row to object
function mapRowToJourney(row) {
    return {
        id: row.journey_id,
        cropId: row.crop_id,
        cropName: row.crop_name,
        startDate: row.start_date,
        status: row.status,
        currentStepIndex: row.current_step_index,
        steps: JSON.parse(row.steps_data || '[]'),
        healthScore: row.health_score,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

module.exports = { initDatabase, getDb, userDb, tokenDb, activityDb, journeyDb };

