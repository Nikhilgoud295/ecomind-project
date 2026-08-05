const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// In-memory fallback user database if Supabase credentials are not connected
const fallbackUsers = [];

const register = async (req, res, next) => {
  try {
    const { name, email, password, organization } = req.body;

    // Check existing user
    if (supabase) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
    } else {
      const existing = fallbackUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    let newUser = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            password_hash,
            organization: organization || 'Individual User',
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
          },
        ])
        .select('id, name, email, organization, avatar_url, created_at')
        .single();

      if (error) throw error;
      newUser = data;
    } else {
      newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name,
        email: email.toLowerCase(),
        password_hash,
        organization: organization || 'Individual User',
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        created_at: new Date().toISOString(),
      };
      fallbackUsers.push(newUser);
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, organization: newUser.organization },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error || !data) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      user = data;
    } else {
      user = fallbackUsers.find(u => u.email === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, organization: user.organization },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let user = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, organization, avatar_url, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user = data;
    } else {
      const found = fallbackUsers.find(u => u.id === userId);
      if (!found) {
        user = {
          id: req.user.id,
          name: req.user.name || 'Demo User',
          email: req.user.email || 'user@ecomind.ai',
          organization: req.user.organization || 'Individual User',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          created_at: new Date().toISOString(),
        };
      } else {
        const { password_hash: _, ...u } = found;
        user = u;
      }
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, organization, avatar_url } = req.body;

    let updatedUser = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({ name, organization, avatar_url, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('id, name, email, organization, avatar_url, updated_at')
        .single();

      if (error) throw error;
      updatedUser = data;
    } else {
      const found = fallbackUsers.find(u => u.id === userId);
      if (found) {
        if (name) found.name = name;
        if (organization) found.organization = organization;
        if (avatar_url) found.avatar_url = avatar_url;
        found.updated_at = new Date().toISOString();
        const { password_hash: _, ...u } = found;
        updatedUser = u;
      } else {
        updatedUser = { id: userId, name: name || req.user.name, email: req.user.email, organization, avatar_url };
      }
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  fallbackUsers,
};
