
import { neon } from '@neondatabase/serverless';
import { OpenMatSession } from '../types/index';

// Chaîne de connexion Neon PostgreSQL avec connection pooling
const connectionString = import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  console.error('❌ VITE_DATABASE_URL is not set!');
  console.error('📝 Add environment variables in Vercel:');
  console.error('   Settings → Environment Variables');
  throw new Error('VITE_DATABASE_URL environment variable is not set. Check Vercel configuration.');
}

// Initialisation de Neon
const sql = neon(connectionString);

export const db = {
  // Récupérer les sessions par statut (approuvé ou tout)
  getSessions: async (status?: 'pending' | 'approved'): Promise<OpenMatSession[]> => {
    try {
      const query = status 
        ? 'SELECT * FROM open_mats WHERE status = $1 ORDER BY date ASC'
        : 'SELECT * FROM open_mats ORDER BY created_at DESC';
      
      const results = await sql(query, status ? [status] : []);
      
      return results.map(row => ({
        id: row.id,
        title: row.title,
        club: row.club,
        city: row.city,
        address: row.address,
        date: row.date,
        time: row.time_range || row.time || '', // Mapper time_range vers time
        price: row.price,
        type: (row.discipline || row.type || 'JJB') as 'JJB' | 'Luta Livre' | 'Mixte', // Mapper discipline vers type
        description: row.description,
        status: row.status,
        photo: row.photo || undefined,
        likes_count: row.likes_count || 0,
        instagram: row.instagram || undefined,
        coordinates: {
          lat: row.lat || 48.8566,
          lng: row.lng || 2.3522,
          x: row.x || 50,
          y: row.y || 50
        }
      }));
    } catch (error) {
      console.error("❌ Erreur de récupération des données:", error);
      return [];
    }
  },

  // Ajouter une nouvelle session d'Open Mat
  addSession: async (session: Omit<OpenMatSession, 'id' | 'status'>) => {
    const hasPhoto = session.photo !== undefined && session.photo !== null;
    const hasInstagram = session.instagram !== undefined && session.instagram !== null && session.instagram.trim() !== '';
    
    if (hasPhoto && hasInstagram) {
      return sql(
        `INSERT INTO open_mats (title, club, city, address, date, time_range, price, discipline, description, photo, instagram)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          session.title, session.club, session.city, session.address, 
          session.date, session.time, session.price, session.type, 
          session.description, session.photo, session.instagram
        ]
      );
    } else if (hasPhoto) {
      return sql(
        `INSERT INTO open_mats (title, club, city, address, date, time_range, price, discipline, description, photo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          session.title, session.club, session.city, session.address, 
          session.date, session.time, session.price, session.type, 
          session.description, session.photo
        ]
      );
    } else if (hasInstagram) {
      return sql(
        `INSERT INTO open_mats (title, club, city, address, date, time_range, price, discipline, description, instagram)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          session.title, session.club, session.city, session.address, 
          session.date, session.time, session.price, session.type, 
          session.description, session.instagram
        ]
      );
    } else {
      return sql(
        `INSERT INTO open_mats (title, club, city, address, date, time_range, price, discipline, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          session.title, session.club, session.city, session.address, 
          session.date, session.time, session.price, session.type, 
          session.description
        ]
      );
    }
  },

  // Mettre à jour la photo d'une session (Admin)
  updateSessionPhoto: async (id: string, photo: string) => {
    return sql('UPDATE open_mats SET photo = $1 WHERE id = $2', [photo, id]);
  },

  // Approuver une session (Admin)
  approveSession: async (id: string) => {
    return sql('UPDATE open_mats SET status = \'approved\' WHERE id = $1', [id]);
  },

  // Retirer l'approbation d'une session (Admin)
  unapproveSession: async (id: string) => {
    return sql('UPDATE open_mats SET status = \'pending\' WHERE id = $1', [id]);
  },

  // Mettre à jour une session (Admin)
  updateSession: async (id: string, session: Partial<Omit<OpenMatSession, 'id' | 'status' | 'coordinates'>>) => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (session.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(session.title);
    }
    if (session.club !== undefined) {
      fields.push(`club = $${paramIndex++}`);
      values.push(session.club);
    }
    if (session.city !== undefined) {
      fields.push(`city = $${paramIndex++}`);
      values.push(session.city);
    }
    if (session.address !== undefined) {
      fields.push(`address = $${paramIndex++}`);
      values.push(session.address);
    }
    if (session.date !== undefined) {
      fields.push(`date = $${paramIndex++}`);
      values.push(session.date);
    }
    if (session.time !== undefined) {
      fields.push(`time_range = $${paramIndex++}`);
      values.push(session.time);
    }
    if (session.price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(session.price);
    }
    if (session.type !== undefined) {
      fields.push(`discipline = $${paramIndex++}`);
      values.push(session.type);
    }
    if (session.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(session.description);
    }
    if (session.photo !== undefined) {
      fields.push(`photo = $${paramIndex++}`);
      values.push(session.photo);
    }
    if (session.instagram !== undefined) {
      fields.push(`instagram = $${paramIndex++}`);
      values.push(session.instagram.trim() || null);
    }

    if (fields.length === 0) return;

    values.push(id);
    const query = `UPDATE open_mats SET ${fields.join(', ')} WHERE id = $${paramIndex}`;
    return sql(query, values);
  },

  // Supprimer une session (Admin)
  deleteSession: async (id: string) => {
    return sql('DELETE FROM open_mats WHERE id = $1', [id]);
  },

  // Vérifier les identifiants Admin dans la table 'admins'
  verifyAdmin: async (username: string, passwordHash: string): Promise<{success: boolean, admin?: any}> => {
    try {
      const result = await sql('SELECT id, username, email, role, created_at FROM admins WHERE username = $1 AND password_hash = $2', [username, passwordHash]);
      if (result.length > 0) {
        return { success: true, admin: result[0] };
      }
      return { success: false };
    } catch (err) {
      console.error("Erreur d'authentification admin:", err);
      return { success: false };
    }
  },

  // Récupérer tous les admins
  getAdmins: async () => {
    try {
      const result = await sql('SELECT id, username, email, role, created_at FROM admins ORDER BY created_at DESC');
      return result;
    } catch (error) {
      console.error("❌ Erreur de récupération des admins:", error);
      return [];
    }
  },

  // Ajouter un nouvel admin
  addAdmin: async (username: string, email: string, passwordHash: string, role: string = 'moderator') => {
    try {
      const result = await sql(
        'INSERT INTO admins (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
        [username, email, passwordHash, role]
      );
      return { success: true, admin: result[0] };
    } catch (error) {
      console.error("❌ Erreur d'ajout d'admin:", error);
      return { success: false, error };
    }
  },

  // Supprimer un admin
  deleteAdmin: async (id: string) => {
    try {
      await sql('DELETE FROM admins WHERE id = $1', [id]);
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur de suppression d'admin:", error);
      return { success: false, error };
    }
  },

  // Changer le mot de passe d'un admin
  changeAdminPassword: async (username: string, oldPasswordHash: string, newPasswordHash: string) => {
    try {
      // Vérifier l'ancien mot de passe
      const verification = await sql('SELECT id FROM admins WHERE username = $1 AND password_hash = $2', [username, oldPasswordHash]);
      if (verification.length === 0) {
        return { success: false, error: 'Ancien mot de passe incorrect' };
      }
      
      // Mettre à jour le mot de passe
      await sql('UPDATE admins SET password_hash = $1 WHERE username = $2', [newPasswordHash, username]);
      return { success: true };
    } catch (error) {
      console.error("❌ Erreur de changement de mot de passe:", error);
      return { success: false, error };
    }
  },

  // Exporter les données (sessions)
  exportSessions: async () => {
    try {
      const result = await sql('SELECT * FROM open_mats ORDER BY created_at DESC');
      return { success: true, data: result };
    } catch (error) {
      console.error("❌ Erreur d'export:", error);
      return { success: false, error };
    }
  },

  // Statistiques système
  getSystemStats: async () => {
    try {
      const totalSessions = await sql('SELECT COUNT(*) as count FROM open_mats');
      const approvedSessions = await sql('SELECT COUNT(*) as count FROM open_mats WHERE status = \'approved\'');
      const pendingSessions = await sql('SELECT COUNT(*) as count FROM open_mats WHERE status = \'pending\'');
      const withPhotos = await sql('SELECT COUNT(*) as count FROM open_mats WHERE photo IS NOT NULL');
      const totalAdmins = await sql('SELECT COUNT(*) as count FROM admins');
      
      return {
        totalSessions: totalSessions[0].count,
        approvedSessions: approvedSessions[0].count,
        pendingSessions: pendingSessions[0].count,
        withPhotos: withPhotos[0].count,
        totalAdmins: totalAdmins[0].count
      };
    } catch (error) {
      console.error("❌ Erreur de stats:", error);
      return null;
    }
  },

  // Ajouter un like à une session
  addLike: async (sessionId: string, userId: string) => {
    try {
      // Vérifier si l'utilisateur a déjà liké
      const existing = await sql(
        'SELECT id FROM session_likes WHERE session_id = $1 AND user_id = $2',
        [sessionId, userId]
      );
      
      if (existing.length > 0) {
        return { success: false, message: 'Déjà liké' };
      }

      // Ajouter le like
      await sql(
        'INSERT INTO session_likes (session_id, user_id) VALUES ($1, $2)',
        [sessionId, userId]
      );

      // Mettre à jour le compteur
      await sql(
        'UPDATE open_mats SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = $1',
        [sessionId]
      );

      // Récupérer le nouveau nombre de likes
      const result = await sql(
        'SELECT likes_count FROM open_mats WHERE id = $1',
        [sessionId]
      );

      return { 
        success: true, 
        likes_count: result[0]?.likes_count || 1 
      };
    } catch (error) {
      console.error("❌ Erreur d'ajout de like:", error);
      return { success: false, error };
    }
  },

  // Retirer un like d'une session
  removeLike: async (sessionId: string, userId: string) => {
    try {
      // Supprimer le like
      const result = await sql(
        'DELETE FROM session_likes WHERE session_id = $1 AND user_id = $2 RETURNING id',
        [sessionId, userId]
      );

      if (result.length === 0) {
        return { success: false, message: 'Like non trouvé' };
      }

      // Mettre à jour le compteur
      await sql(
        'UPDATE open_mats SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE id = $1',
        [sessionId]
      );

      // Récupérer le nouveau nombre de likes
      const newCount = await sql(
        'SELECT likes_count FROM open_mats WHERE id = $1',
        [sessionId]
      );

      return { 
        success: true, 
        likes_count: newCount[0]?.likes_count || 0 
      };
    } catch (error) {
      console.error("❌ Erreur de suppression de like:", error);
      return { success: false, error };
    }
  },

  // Vérifier si un utilisateur a liké une session
  hasLiked: async (sessionId: string, userId: string): Promise<boolean> => {
    try {
      const result = await sql(
        'SELECT id FROM session_likes WHERE session_id = $1 AND user_id = $2',
        [sessionId, userId]
      );
      return result.length > 0;
    } catch (error) {
      console.error("❌ Erreur de vérification de like:", error);
      return false;
    }
  },

  // Récupérer le nombre de likes d'une session
  getLikesCount: async (sessionId: string): Promise<number> => {
    try {
      const result = await sql(
        'SELECT likes_count FROM open_mats WHERE id = $1',
        [sessionId]
      );
      return result[0]?.likes_count || 0;
    } catch (error) {
      console.error("❌ Erreur de récupération des likes:", error);
      return 0;
    }
  },

  // Récupérer les sessions likées par un utilisateur
  getUserLikedSessions: async (userId: string): Promise<string[]> => {
    try {
      const result = await sql(
        'SELECT session_id FROM session_likes WHERE user_id = $1',
        [userId]
      );
      return result.map(row => row.session_id);
    } catch (error) {
      console.error("❌ Erreur de récupération des sessions likées:", error);
      return [];
    }
  }
};
