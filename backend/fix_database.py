#!/usr/bin/env python3
"""
Script to fix database schema by adding missing columns
"""
import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'smartpol_chatbot',
    'charset': 'utf8mb4'
}

def fix_database():
    """Fix database schema by adding missing columns"""
    try:
        # Connect to database
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        print("Connected to database successfully")
        
        # Check if avatar_url column exists
        cursor.execute("SHOW COLUMNS FROM user LIKE 'avatar_url'")
        if not cursor.fetchone():
            print("Adding avatar_url column to user table...")
            cursor.execute("ALTER TABLE user ADD COLUMN avatar_url VARCHAR(255) NULL")
            print("✓ avatar_url column added")
        else:
            print("✓ avatar_url column already exists")
        
        # Check if is_admin column exists in user table
        cursor.execute("SHOW COLUMNS FROM user LIKE 'is_admin'")
        if not cursor.fetchone():
            print("Adding is_admin column to user table...")
            cursor.execute("ALTER TABLE user ADD COLUMN is_admin BOOLEAN DEFAULT FALSE")
            print("✓ is_admin column added")
        else:
            print("✓ is_admin column already exists")
        
        # Commit changes
        connection.commit()
        print("Database schema fixed successfully!")
        
    except Exception as e:
        print(f"Error fixing database: {e}")
        if 'connection' in locals():
            connection.rollback()
    finally:
        if 'connection' in locals():
            connection.close()

if __name__ == "__main__":
    fix_database()
