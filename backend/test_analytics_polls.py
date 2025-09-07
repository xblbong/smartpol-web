#!/usr/bin/env python3
"""
Script untuk testing endpoint analytics polls
"""

import requests
import json
from datetime import datetime

# Base URL untuk API
BASE_URL = "http://localhost:5000/api"

# Headers untuk request
headers = {
    'Content-Type': 'application/json'
}

def test_poll_analytics():
    """Test Poll Analytics endpoint"""
    print("=== Testing Poll Analytics Endpoint ===")
    
    try:
        response = requests.get(f"{BASE_URL}/admin/analytics/polls", headers=headers)
        
        if response.status_code == 200:
            print("✅ Poll analytics endpoint berhasil")
            data = response.json()
            
            print("\n📊 Data yang dikembalikan:")
            print(f"Category Distribution: {len(data.get('category_distribution', []))} categories")
            print(f"Status Distribution: {len(data.get('status_distribution', []))} statuses")
            print(f"Total Votes: {data.get('vote_statistics', {}).get('total_votes', 0)}")
            print(f"Unique Voters: {data.get('vote_statistics', {}).get('unique_voters', 0)}")
            print(f"Top Polls: {len(data.get('top_polls', []))} polls")
            
            # Print detailed data
            print("\n📈 Category Distribution:")
            for cat in data.get('category_distribution', []):
                print(f"  - {cat['category']}: {cat['count']} polls")
            
            print("\n📊 Status Distribution:")
            for status in data.get('status_distribution', []):
                print(f"  - {status['status']}: {status['count']} polls")
            
            print("\n🏆 Top Polls:")
            for poll in data.get('top_polls', [])[:5]:  # Show top 5
                print(f"  - {poll['title']}: {poll['vote_count']} votes")
                
        else:
            print(f"❌ Poll analytics endpoint gagal: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing poll analytics: {e}")

def test_user_analytics():
    """Test User Analytics endpoint"""
    print("\n=== Testing User Analytics Endpoint ===")
    
    try:
        response = requests.get(f"{BASE_URL}/admin/analytics/users", headers=headers)
        
        if response.status_code == 200:
            print("✅ User analytics endpoint berhasil")
            data = response.json()
            
            print("\n👥 User Analytics Data:")
            print(f"Role Distribution: {len(data.get('role_distribution', []))} roles")
            print(f"Registration Trend: {len(data.get('registration_trend', []))} days")
            print(f"Active Users: {data.get('activity_status', {}).get('active', 0)}")
            print(f"Inactive Users: {data.get('activity_status', {}).get('inactive', 0)}")
            
            # Print role distribution
            print("\n📊 Role Distribution:")
            for role in data.get('role_distribution', []):
                print(f"  - {role['role']}: {role['count']} users")
                
        else:
            print(f"❌ User analytics endpoint gagal: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing user analytics: {e}")

def test_quick_stats():
    """Test Quick Stats endpoint"""
    print("\n=== Testing Quick Stats Endpoint ===")
    
    try:
        response = requests.get(f"{BASE_URL}/admin/dashboard/quick-stats", headers=headers)
        
        if response.status_code == 200:
            print("✅ Quick stats endpoint berhasil")
            data = response.json()
            
            print("\n⚡ Quick Stats Data:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
                
        else:
            print(f"❌ Quick stats endpoint gagal: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing quick stats: {e}")

if __name__ == "__main__":
    test_poll_analytics()
    test_user_analytics()
    test_quick_stats()
    print("\n🎯 Testing selesai!")