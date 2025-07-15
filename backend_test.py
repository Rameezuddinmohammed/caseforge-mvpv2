#!/usr/bin/env python3
"""
Backend Testing for Caseforge Next.js Application with Supabase
Tests Supabase connectivity and basic functionality
"""

import requests
import sys
import os
from datetime import datetime

class SupabaseAPITester:
    def __init__(self):
        # Supabase configuration from .env.local
        self.supabase_url = "https://wdjlmtptomcqvxmzpjbw.supabase.co"
        self.supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkamxtdHB0b21jcXZ4bXpwamJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTAwNDEsImV4cCI6MjA2Nzk4NjA0MX0.xF684n4tI6cwwiXXgWlIYj0sTasOEnY5VGQ0SnOzvWE"
        self.base_url = f"{self.supabase_url}/rest/v1"
        self.headers = {
            'apikey': self.supabase_anon_key,
            'Authorization': f'Bearer {self.supabase_anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=self.headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=self.headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        json_response = response.json()
                        if isinstance(json_response, list):
                            print(f"   Response: {len(json_response)} items returned")
                        else:
                            print(f"   Response: {json_response}")
                    except:
                        print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_supabase_connection(self):
        """Test basic Supabase connection"""
        print("🚀 Testing Supabase Connection...")
        
        # Test basic connection with a simple query
        success, response = self.run_test(
            "Supabase Connection",
            "GET",
            "user_profiles?select=id&limit=1",
            200
        )
        return success

    def test_database_tables(self):
        """Test if main database tables exist"""
        tables_to_test = [
            "user_profiles",
            "user_stats", 
            "achievements",
            "cases",
            "daily_challenges",
            "submissions"
        ]
        
        print("\n📊 Testing Database Tables...")
        table_results = {}
        
        for table in tables_to_test:
            success, response = self.run_test(
                f"Table: {table}",
                "GET",
                f"{table}?select=*&limit=1",
                200
            )
            table_results[table] = success
            
        return table_results

    def test_cases_endpoint(self):
        """Test cases endpoint specifically"""
        print("\n📚 Testing Cases Functionality...")
        
        # Test getting cases
        success, response = self.run_test(
            "Get Cases",
            "GET", 
            "cases?select=*&is_active=eq.true&limit=5",
            200
        )
        
        return success, response

    def test_daily_challenges(self):
        """Test daily challenges endpoint"""
        print("\n🎯 Testing Daily Challenges...")
        
        success, response = self.run_test(
            "Get Daily Challenges",
            "GET",
            "daily_challenges?select=*&is_active=eq.true&limit=1",
            200
        )
        
        return success, response

def main():
    print("=" * 60)
    print("🧪 CASEFORGE BACKEND TESTING")
    print("=" * 60)
    print("Testing Supabase backend connectivity and basic functionality")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = SupabaseAPITester()
    
    # Test 1: Basic connection
    if not tester.test_supabase_connection():
        print("\n❌ Basic connection failed. Stopping tests.")
        return 1
    
    # Test 2: Database tables
    table_results = tester.test_database_tables()
    
    # Test 3: Cases functionality
    cases_success, cases_data = tester.test_cases_endpoint()
    
    # Test 4: Daily challenges
    challenges_success, challenges_data = tester.test_daily_challenges()
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Total tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    print("\n📋 Table Status:")
    for table, status in table_results.items():
        status_icon = "✅" if status else "❌"
        print(f"  {status_icon} {table}")
    
    print(f"\n🎯 Cases endpoint: {'✅' if cases_success else '❌'}")
    print(f"🎯 Daily challenges: {'✅' if challenges_success else '❌'}")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 All tests passed! Backend is ready for frontend testing.")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} tests failed. Check configuration.")
        return 1

if __name__ == "__main__":
    sys.exit(main())