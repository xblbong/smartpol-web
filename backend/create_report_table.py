#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Report
from sqlalchemy import text

def create_report_table():
    """Create the report table manually"""
    with app.app_context():
        try:
            # Check if table exists
            with db.engine.connect() as connection:
                result = connection.execute(text("SHOW TABLES LIKE 'report'"))
                if result.fetchone():
                    print("Table 'report' already exists.")
                    return True
            
            # Create the table
            db.create_all()
            print("Report table created successfully!")
            
            # Verify table creation
            with db.engine.connect() as connection:
                result = connection.execute(text("DESCRIBE report"))
                columns = result.fetchall()
                print("\nTable structure:")
                for column in columns:
                    print(f"  {column[0]} - {column[1]}")
                
        except Exception as e:
            print(f"Error creating report table: {e}")
            return False
        
        return True

if __name__ == '__main__':
    print("Creating Report table...")
    success = create_report_table()
    if success:
        print("\nReport table setup completed successfully!")
    else:
        print("\nFailed to create report table.")
        sys.exit(1)