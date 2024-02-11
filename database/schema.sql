-- usersテーブルの作成
DROP TABLE IF EXISTS todo_categories CASCADE;
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  avatar VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- todosテーブルの作成
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- categoriesテーブルの作成
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- todo_categoriesピボットテーブルの作成
CREATE TABLE todo_categories (
  todo_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (todo_id, category_id),
  FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- usersテーブルへのデータ挿入
INSERT INTO users (name, email, password, is_admin, avatar) VALUES
('山田太郎', 'taro.yamada@example.com', 'password123', FALSE, 'https://example.com/avatars/yamada.png'),
('鈴木花子', 'hanako.suzuki@example.com', 'password123', FALSE, 'https://example.com/avatars/suzuki.png'),
('佐藤健', 'ken.sato@example.com', 'password123', TRUE, 'https://example.com/avatars/sato.png'),
('伊藤涼子', 'ryoko.ito@example.com', 'password123', FALSE, 'https://example.com/avatars/ito.png'),
('高橋美咲', 'misaki.takahashi@example.com', 'password123', FALSE, 'https://example.com/avatars/takahashi.png');

-- todosテーブルへのデータ挿入
INSERT INTO todos (user_id, title) VALUES
(1, '買い物に行く'),
(2, 'レポートを提出する'),
(3, '犬の散歩をする'),
(1, '医者の予約を取る'),
(2, '友達との会合を計画する');

-- categoriesテーブルへのデータ挿入
INSERT INTO categories (title) VALUES
('技術'),
('料理'),
('旅行'),
('教育'),
('健康・フィットネス'),
('趣味'),
('芸術'),
('ニュース'),
('エンターテインメント'),
('スポーツ');

-- todo_categoriesピボットテーブルへのデータ挿入
INSERT INTO todo_categories (todo_id, category_id) VALUES
(1, 1),
(2, 5),
(3, 3),
(1, 4),
(2, 2),
(4, 10),
(5, 9);

SELECT 
    u.name AS user_name, 
    t.title AS todo_title, 
    c.title AS category_title, 
    t.created_at  AS todo_created_at
FROM 
    users u
JOIN 
    todos t ON u.id = t.user_id
JOIN 
    todo_categories tc ON t.id = tc.todo_id
JOIN 
    categories c ON tc.category_id = c.id
ORDER BY 
    u.name, t.title, c.title;
