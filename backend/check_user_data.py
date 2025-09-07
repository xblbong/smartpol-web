import pymysql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_user_data():
    try:
        # Get database configuration
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = int(os.getenv('DB_PORT', 3306))
        db_name = os.getenv('DB_NAME', 'smartpol_chatbot')
        db_user = os.getenv('DB_USER', 'root')
        db_password = os.getenv('DB_PASSWORD', '')
        
        # Connect to database
        connection = pymysql.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Check user table structure
            cursor.execute("DESCRIBE user")
            columns = cursor.fetchall()
            print("User table structure:")
            for column in columns:
                print(f"  {column[0]} - {column[1]} - {column[2]} - {column[3]}")
            
            print("\n" + "="*50)
            
            # Check user count by role
            cursor.execute("SELECT role, COUNT(*) as count FROM user GROUP BY role")
            role_counts = cursor.fetchall()
            print("\nUser count by role:")
            for role, count in role_counts:
                print(f"  {role}: {count} users")
            
            print("\n" + "="*50)
            
            # Check officials table
            cursor.execute("SELECT COUNT(*) as count FROM officials")
            officials_count = cursor.fetchone()[0]
            print(f"\nOfficials count: {officials_count}")
            
            if officials_count > 0:
                cursor.execute("SELECT name, position, party FROM officials LIMIT 5")
                officials = cursor.fetchall()
                print("\nSample officials data:")
                for official in officials:
                    print(f"  {official[0]} - {official[1]} - {official[2]}")
            
            print("\n" + "="*50)
            
            # Check polling data
            cursor.execute("SELECT COUNT(*) as count FROM polling")
            polling_count = cursor.fetchone()[0]
            print(f"\nPolling count: {polling_count}")
            
            # Check report data
            cursor.execute("SELECT COUNT(*) as count FROM report")
            report_count = cursor.fetchone()[0]
            print(f"Report count: {report_count}")
            
            # Check policy data
            cursor.execute("SELECT COUNT(*) as count FROM policy")
            policy_count = cursor.fetchone()[0]
            print(f"Policy count: {policy_count}")
                
        connection.close()
        print("\n✅ Database data check completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Database check failed: {str(e)}")
        return False

if __name__ == '__main__':
    check_user_data()