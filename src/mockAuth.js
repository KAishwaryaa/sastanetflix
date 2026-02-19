// Mock Authentication Service using LocalStorage
// Mimics Firebase Auth and Firestore structure

const MOCK_DELAY = 800; // ms to simulate network delay

// Helper to simulate async operations
const simulateAsync = (data, shouldFail = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Network Error or Invalid Credentials"));
            } else {
                resolve(data);
            }
        }, MOCK_DELAY);
    });
};

export const auth = {
    currentUser: JSON.parse(localStorage.getItem("sasta_netflix_user")),
};

// Mock listeners similar to onAuthStateChanged
const listeners = [];
export const onAuthStateChanged = (authInstance, callback) => {
    // Check initial state
    const storedUser = JSON.parse(localStorage.getItem("sasta_netflix_user"));
    if (storedUser) {
        callback(storedUser);
    } else {
        callback(null);
    }

    // Register listener
    listeners.push(callback);

    // Return unsubscribe function
    return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

// Trigger all listeners when auth state changes
const notifyListeners = (user) => {
    listeners.forEach(callback => callback(user));
};

export const createUserWithEmailAndPassword = async (authInstance, email, password) => {
    // Check if user already exists (simplistic check)
    const users = JSON.parse(localStorage.getItem("sasta_netflix_users_db") || "[]");
    const existing = users.find(u => u.email === email);

    if (existing) {
        throw new Error("Email already in use");
    }

    const newUser = {
        uid: "mock-uid-" + Date.now(),
        email: email,
        emailVerified: false,
        isAnonymous: false,
    };

    localStorage.setItem("sasta_netflix_user", JSON.stringify(newUser));
    auth.currentUser = newUser;
    notifyListeners(newUser);

    return simulateAsync({ user: newUser });
}

export const signInWithEmailAndPassword = async (authInstance, email, password) => {
    // For demo, we accept any login if it matches a created user, OR 
    // we can just allow any login for "Demo" ease if user hasn't signed up.
    // Let's check against our mock DB.

    const users = JSON.parse(localStorage.getItem("sasta_netflix_users_db") || "[]");
    // const user = users.find(u => u.email === email); // Strict mode

    // LENIENT MODE: Allow login even if not found in mock DB, to make it easier for user
    const user = {
        uid: "mock-uid-" + Date.now(),
        email: email,
    };

    localStorage.setItem("sasta_netflix_user", JSON.stringify(user));
    auth.currentUser = user;
    notifyListeners(user);

    return simulateAsync({ user: user });
}

export const signOut = async (authInstance) => {
    localStorage.removeItem("sasta_netflix_user");
    auth.currentUser = null;
    notifyListeners(null);
    return simulateAsync(true);
}

// Mock Firestore
export const db = {};

export const doc = (dbInstance, collection, id) => {
    return { collection, id };
}

export const setDoc = async (docRef, data) => {
    const users = JSON.parse(localStorage.getItem("sasta_netflix_users_db") || "[]");

    // Check if updating or creating
    const existingIndex = users.findIndex(u => u.uid === docRef.id);

    if (existingIndex >= 0) {
        users[existingIndex] = { ...users[existingIndex], ...data };
    } else {
        users.push(data);
    }

    localStorage.setItem("sasta_netflix_users_db", JSON.stringify(users));
    return simulateAsync(true);
}
