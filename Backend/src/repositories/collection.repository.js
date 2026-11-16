import db from "../config/db.js";

export class CollectionRepository {
  async createCollection(userId, { title, description = null }) {
    const text = `
      INSERT INTO personal_collections (user_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await db.query(text, [userId, title.trim(), description]);
    return rows[0];
  }

  async getCollections(userId) {
    const text = `
      SELECT c.*, COUNT(ci.id)::int AS items_count
      FROM personal_collections c
      LEFT JOIN collection_items ci ON c.id = ci.collection_id
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC;
    `;
    const { rows } = await db.query(text, [userId]);
    return rows;
  }

  async getCollectionById(id, userId) {
    const text = `
      SELECT *
      FROM personal_collections
      WHERE id = $1 AND user_id = $2;
    `;
    const { rows } = await db.query(text, [id, userId]);
    return rows[0] || null;
  }

  async updateCollection(id, userId, { title, description }) {
    const text = `
      UPDATE personal_collections
      SET title = COALESCE($3, title),
          description = COALESCE($4, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(text, [id, userId, title, description]);
    return rows[0] || null;
  }

  async deleteCollection(id, userId) {
    const text = `
      DELETE FROM personal_collections
      WHERE id = $1 AND user_id = $2
      RETURNING id;
    `;
    const { rows } = await db.query(text, [id, userId]);
    return rows[0] || null;
  }

  async addItem(collectionId, { shabadId = null, lineId = null, source = null, position = 0, note = null }) {
    const text = `
      INSERT INTO collection_items (collection_id, shabad_id, line_id, source, position, note)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [collectionId, shabadId, lineId, source, position, note];
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async getItems(collectionId) {
    const text = `
      SELECT *
      FROM collection_items
      WHERE collection_id = $1
      ORDER BY position ASC, created_at ASC;
    `;
    const { rows } = await db.query(text, [collectionId]);
    return rows;
  }

  async removeItem(itemId, collectionId) {
    const text = `
      DELETE FROM collection_items
      WHERE id = $1 AND collection_id = $2
      RETURNING id;
    `;
    const { rows } = await db.query(text, [itemId, collectionId]);
    return rows[0] || null;
  }
}

export default new CollectionRepository();
