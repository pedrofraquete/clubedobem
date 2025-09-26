#!/usr/bin/env python3
"""
Backend Testing for Next.js Marketplace Application - Supabase Integration
Testing the Supabase database connection and API functionality
"""

import os
import sys
import requests
import json
from typing import Dict, Any, List
import time

class SupabaseBackendTester:
    def __init__(self):
        # Load environment variables from .env.local
        self.load_env_vars()
        
        # Supabase configuration
        self.supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        self.supabase_anon_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        self.service_role_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not all([self.supabase_url, self.supabase_anon_key]):
            raise ValueError("Missing required Supabase environment variables")
        
        # Headers for API requests
        self.headers = {
            'apikey': self.supabase_anon_key,
            'Authorization': f'Bearer {self.supabase_anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
        self.admin_headers = {
            'apikey': self.service_role_key or self.supabase_anon_key,
            'Authorization': f'Bearer {self.service_role_key or self.supabase_anon_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
        
        self.test_results = []
        
    def load_env_vars(self):
        """Load environment variables from .env.local file"""
        env_file = '/app/.env.local'
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key] = value
    
    def log_test(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")
    
    def test_supabase_connection(self):
        """Test basic Supabase connection"""
        try:
            # Test basic connection to Supabase REST API
            url = f"{self.supabase_url}/rest/v1/"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                self.log_test(
                    "Supabase Connection", 
                    True, 
                    "Successfully connected to Supabase REST API",
                    {"status_code": response.status_code, "url": url}
                )
                return True
            else:
                self.log_test(
                    "Supabase Connection", 
                    False, 
                    f"Failed to connect to Supabase REST API",
                    {"status_code": response.status_code, "response": response.text[:200]}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Supabase Connection", 
                False, 
                f"Connection error: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    def test_categories_table(self):
        """Test categories table access"""
        try:
            url = f"{self.supabase_url}/rest/v1/categories"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                categories = response.json()
                self.log_test(
                    "Categories Table Access", 
                    True, 
                    f"Successfully retrieved {len(categories)} categories",
                    {"categories_count": len(categories), "sample": categories[:2] if categories else []}
                )
                return True, categories
            else:
                self.log_test(
                    "Categories Table Access", 
                    False, 
                    f"Failed to access categories table",
                    {"status_code": response.status_code, "response": response.text[:200]}
                )
                return False, []
                
        except Exception as e:
            self.log_test(
                "Categories Table Access", 
                False, 
                f"Error accessing categories: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False, []
    
    def test_products_table(self):
        """Test products table access"""
        try:
            # Test basic products query
            url = f"{self.supabase_url}/rest/v1/products"
            params = {
                'select': '*,category:categories(name,slug)',
                'is_active': 'eq.true',
                'limit': 10
            }
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                self.log_test(
                    "Products Table Access", 
                    True, 
                    f"Successfully retrieved {len(products)} products",
                    {"products_count": len(products), "sample": products[:1] if products else []}
                )
                return True, products
            else:
                self.log_test(
                    "Products Table Access", 
                    False, 
                    f"Failed to access products table",
                    {"status_code": response.status_code, "response": response.text[:200]}
                )
                return False, []
                
        except Exception as e:
            self.log_test(
                "Products Table Access", 
                False, 
                f"Error accessing products: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False, []
    
    def test_products_with_categories_join(self):
        """Test products query with category join"""
        try:
            url = f"{self.supabase_url}/rest/v1/products"
            params = {
                'select': 'id,name,price,rating,stock,category:categories(name,slug)',
                'is_active': 'eq.true',
                'limit': 5
            }
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                # Check if category join is working
                has_category_data = any(product.get('category') for product in products)
                
                self.log_test(
                    "Products-Categories Join", 
                    has_category_data, 
                    f"Category join {'working' if has_category_data else 'not working'} - {len(products)} products",
                    {"products_with_categories": len([p for p in products if p.get('category')])}
                )
                return has_category_data, products
            else:
                self.log_test(
                    "Products-Categories Join", 
                    False, 
                    f"Failed to query products with categories",
                    {"status_code": response.status_code, "response": response.text[:200]}
                )
                return False, []
                
        except Exception as e:
            self.log_test(
                "Products-Categories Join", 
                False, 
                f"Error in products-categories join: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False, []
    
    def test_database_schema(self):
        """Test if required tables exist"""
        required_tables = ['users', 'categories', 'products', 'cart_items', 'favorites', 'orders', 'reviews']
        schema_results = {}
        
        for table in required_tables:
            try:
                url = f"{self.supabase_url}/rest/v1/{table}"
                params = {'limit': 1}
                response = requests.get(url, headers=self.headers, params=params, timeout=10)
                
                schema_results[table] = {
                    'exists': response.status_code == 200,
                    'status_code': response.status_code
                }
                
            except Exception as e:
                schema_results[table] = {
                    'exists': False,
                    'error': str(e)
                }
        
        existing_tables = [table for table, result in schema_results.items() if result['exists']]
        missing_tables = [table for table, result in schema_results.items() if not result['exists']]
        
        success = len(existing_tables) >= 2  # At least categories and products should exist
        
        self.log_test(
            "Database Schema", 
            success, 
            f"Found {len(existing_tables)}/{len(required_tables)} required tables",
            {
                "existing_tables": existing_tables,
                "missing_tables": missing_tables,
                "schema_details": schema_results
            }
        )
        
        return success, schema_results
    
    def test_rls_policies(self):
        """Test Row Level Security policies"""
        try:
            # Test public read access to categories (should work)
            url = f"{self.supabase_url}/rest/v1/categories"
            response = requests.get(url, headers=self.headers, timeout=10)
            
            categories_accessible = response.status_code == 200
            
            # Test public read access to products (should work for active products)
            url = f"{self.supabase_url}/rest/v1/products"
            params = {'is_active': 'eq.true', 'limit': 1}
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            
            products_accessible = response.status_code == 200
            
            success = categories_accessible and products_accessible
            
            self.log_test(
                "RLS Policies", 
                success, 
                f"Public access policies {'working' if success else 'not working'}",
                {
                    "categories_accessible": categories_accessible,
                    "products_accessible": products_accessible
                }
            )
            
            return success
            
        except Exception as e:
            self.log_test(
                "RLS Policies", 
                False, 
                f"Error testing RLS policies: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    def test_data_integrity(self):
        """Test data integrity and relationships"""
        try:
            # Get products with categories
            url = f"{self.supabase_url}/rest/v1/products"
            params = {
                'select': 'id,name,price,category_id,category:categories(id,name)',
                'is_active': 'eq.true',
                'limit': 5
            }
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code != 200:
                self.log_test(
                    "Data Integrity", 
                    False, 
                    "Failed to retrieve products for integrity check",
                    {"status_code": response.status_code}
                )
                return False
            
            products = response.json()
            
            # Check data integrity
            integrity_issues = []
            valid_products = 0
            
            for product in products:
                issues = []
                
                # Check required fields
                if not product.get('name'):
                    issues.append("missing name")
                if not product.get('price') or product['price'] <= 0:
                    issues.append("invalid price")
                if not product.get('category_id'):
                    issues.append("missing category_id")
                if not product.get('category'):
                    issues.append("category relationship broken")
                
                if issues:
                    integrity_issues.append({
                        'product_id': product.get('id'),
                        'issues': issues
                    })
                else:
                    valid_products += 1
            
            success = len(integrity_issues) == 0 and valid_products > 0
            
            self.log_test(
                "Data Integrity", 
                success, 
                f"Data integrity {'good' if success else 'has issues'} - {valid_products} valid products",
                {
                    "valid_products": valid_products,
                    "total_checked": len(products),
                    "integrity_issues": integrity_issues[:3]  # Show first 3 issues
                }
            )
            
            return success
            
        except Exception as e:
            self.log_test(
                "Data Integrity", 
                False, 
                f"Error checking data integrity: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🧪 Starting Supabase Backend Integration Tests...")
        print("=" * 60)
        
        # Test 1: Basic connection
        connection_ok = self.test_supabase_connection()
        
        if not connection_ok:
            print("\n❌ Cannot proceed with further tests - Supabase connection failed")
            return self.generate_summary()
        
        # Test 2: Database schema
        schema_ok, schema_details = self.test_database_schema()
        
        # Test 3: Categories table
        categories_ok, categories = self.test_categories_table()
        
        # Test 4: Products table
        products_ok, products = self.test_products_table()
        
        # Test 5: Products with categories join
        join_ok, joined_products = self.test_products_with_categories_join()
        
        # Test 6: RLS policies
        rls_ok = self.test_rls_policies()
        
        # Test 7: Data integrity
        integrity_ok = self.test_data_integrity()
        
        print("\n" + "=" * 60)
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"\n📊 TEST SUMMARY:")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "No tests run")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        # Determine overall status
        critical_tests = ['Supabase Connection', 'Database Schema', 'Categories Table Access', 'Products Table Access']
        critical_failures = [r for r in self.test_results if not r['success'] and r['test'] in critical_tests]
        
        if critical_failures:
            overall_status = "CRITICAL_FAILURE"
        elif failed_tests == 0:
            overall_status = "ALL_PASS"
        else:
            overall_status = "MINOR_ISSUES"
        
        return {
            'overall_status': overall_status,
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'test_results': self.test_results,
            'critical_failures': critical_failures
        }

def main():
    """Main test execution"""
    try:
        tester = SupabaseBackendTester()
        summary = tester.run_all_tests()
        
        # Exit with appropriate code
        if summary['overall_status'] == 'CRITICAL_FAILURE':
            sys.exit(1)
        elif summary['overall_status'] == 'MINOR_ISSUES':
            sys.exit(2)
        else:
            sys.exit(0)
            
    except Exception as e:
        print(f"❌ FATAL ERROR: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()