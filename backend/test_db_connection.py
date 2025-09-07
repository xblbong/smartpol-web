import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_database_connection():
    try:
        # Get database configuration
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = int(os.getenv('DB_PORT', 3306))
        db_name = os.getenv('DB_NAME', 'smartpol_chatbot')
        db_user = os.getenv('DB_USER', 'root')
        db_password = os.getenv('DB_PASSWORD', '')
        
        print(f"Testing connection to MySQL database:")
        print(f"Host: {db_host}")
        print(f"Port: {db_port}")
        print(f"Database: {db_name}")
        print(f"User: {db_user}")
        print(f"Password: {'*' * len(db_password) if db_password else '(empty)'}")
        print()
        
        # Test connection
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            charset='utf8mb4'
        )
        
        print("✅ Database connection successful!")
        
        # Test basic query
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"MySQL Version: {version[0]}")
            
            # Check if tables exist
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print(f"\nTables in database ({len(tables)} found):")
            for table in tables:
                print(f"  - {table[0]}")
                
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False

if __name__ == '__main__':
    test_database_connection()