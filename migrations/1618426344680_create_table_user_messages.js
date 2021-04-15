module.exports = {
    "up": `
CREATE TABLE user_messages (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    session_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text BLOB
)`,
    "down": "DROP TABLE user_messages"
}
