#!/usr/bin/env python3
"""
Frontend Integration Test for Supabase
Tests the actual Next.js application's Supabase integration
"""

import requests
import json
import time
import re

class FrontendSupabaseTest:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.test_results = []
    
    def log_test(self, test_name: str, success: bool, message: str, details: dict = None):
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
    
    def test_marketplace_page_loads(self):
        """Test if marketplace page loads"""
        try:
            response = requests.get(f"{self.base_url}/marketplace", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for key elements
                has_products_section = "Produtos em Destaque" in content
                has_loading_state = "Carregando produtos" in content
                has_error_state = "Erro ao carregar produtos" in content
                
                # Check for React hydration
                has_react_scripts = "_next/static" in content
                
                success = response.status_code == 200 and has_react_scripts
                
                self.log_test(
                    "Marketplace Page Load",
                    success,
                    f"Marketplace page {'loaded successfully' if success else 'failed to load'}",
                    {
                        "status_code": response.status_code,
                        "has_products_section": has_products_section,
                        "has_loading_state": has_loading_state,
                        "has_error_state": has_error_state,
                        "has_react_scripts": has_react_scripts,
                        "content_length": len(content)
                    }
                )
                return success, content
            else:
                self.log_test(
                    "Marketplace Page Load",
                    False,
                    f"Failed to load marketplace page",
                    {"status_code": response.status_code}
                )
                return False, ""
                
        except Exception as e:
            self.log_test(
                "Marketplace Page Load",
                False,
                f"Error loading marketplace page: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False, ""
    
    def test_supabase_products_api_call(self):
        """Test if the frontend can make API calls to Supabase"""
        try:
            # Wait a moment for the page to potentially load data
            time.sleep(3)
            
            # Make another request to see if products have loaded
            response = requests.get(f"{self.base_url}/marketplace", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Look for signs that products have loaded
                has_product_grid = 'data-testid="products-grid"' in content
                has_product_cards = 'ProductCard' in content or 'product-card' in content
                has_prices = 'R$' in content
                has_categories = any(cat in content for cat in ['Eletrônicos', 'Roupas', 'Casa'])
                
                # Check if we're still in loading state
                still_loading = "Carregando produtos" in content
                has_error = "Erro ao carregar produtos" in content
                
                # Products loaded successfully if we have product elements and no loading/error
                products_loaded = (has_product_grid or has_prices or has_categories) and not still_loading and not has_error
                
                self.log_test(
                    "Supabase Products API Integration",
                    products_loaded,
                    f"Products {'loaded successfully' if products_loaded else 'not loaded or still loading'}",
                    {
                        "has_product_grid": has_product_grid,
                        "has_product_cards": has_product_cards,
                        "has_prices": has_prices,
                        "has_categories": has_categories,
                        "still_loading": still_loading,
                        "has_error": has_error
                    }
                )
                return products_loaded
            else:
                self.log_test(
                    "Supabase Products API Integration",
                    False,
                    f"Failed to check products API integration",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Supabase Products API Integration",
                False,
                f"Error testing products API: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    def test_database_setup_page(self):
        """Test the database setup page"""
        try:
            response = requests.get(f"{self.base_url}/setup-database", timeout=10)
            
            if response.status_code == 200:
                content = response.text
                
                # Check for setup page elements
                has_setup_title = "Setup do Banco de Dados" in content
                has_setup_button = "Iniciar Setup" in content
                has_categories_mention = "Categorias de produtos" in content
                
                success = has_setup_title and has_setup_button
                
                self.log_test(
                    "Database Setup Page",
                    success,
                    f"Setup page {'accessible' if success else 'not accessible'}",
                    {
                        "status_code": response.status_code,
                        "has_setup_title": has_setup_title,
                        "has_setup_button": has_setup_button,
                        "has_categories_mention": has_categories_mention
                    }
                )
                return success
            else:
                self.log_test(
                    "Database Setup Page",
                    False,
                    f"Setup page not accessible",
                    {"status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Database Setup Page",
                False,
                f"Error accessing setup page: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    def test_app_navigation(self):
        """Test basic app navigation"""
        try:
            # Test homepage
            home_response = requests.get(f"{self.base_url}/", timeout=10)
            home_ok = home_response.status_code == 200
            
            # Test cart page
            cart_response = requests.get(f"{self.base_url}/carrinho", timeout=10)
            cart_ok = cart_response.status_code == 200
            
            # Test favorites page
            favorites_response = requests.get(f"{self.base_url}/favoritos", timeout=10)
            favorites_ok = favorites_response.status_code == 200
            
            success = home_ok and cart_ok and favorites_ok
            
            self.log_test(
                "App Navigation",
                success,
                f"Navigation {'working' if success else 'has issues'}",
                {
                    "home_status": home_response.status_code,
                    "cart_status": cart_response.status_code,
                    "favorites_status": favorites_response.status_code
                }
            )
            return success
            
        except Exception as e:
            self.log_test(
                "App Navigation",
                False,
                f"Error testing navigation: {str(e)}",
                {"error_type": type(e).__name__}
            )
            return False
    
    def run_all_tests(self):
        """Run all frontend integration tests"""
        print("🧪 Starting Frontend Supabase Integration Tests...")
        print("=" * 60)
        
        # Test 1: Marketplace page loads
        marketplace_ok, content = self.test_marketplace_page_loads()
        
        # Test 2: Supabase products API integration
        if marketplace_ok:
            products_api_ok = self.test_supabase_products_api_call()
        else:
            products_api_ok = False
        
        # Test 3: Database setup page
        setup_ok = self.test_database_setup_page()
        
        # Test 4: App navigation
        nav_ok = self.test_app_navigation()
        
        print("\n" + "=" * 60)
        return self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"\n📊 FRONTEND INTEGRATION TEST SUMMARY:")
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
        critical_tests = ['Marketplace Page Load', 'Supabase Products API Integration']
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
        tester = FrontendSupabaseTest()
        summary = tester.run_all_tests()
        
        # Exit with appropriate code
        if summary['overall_status'] == 'CRITICAL_FAILURE':
            exit(1)
        elif summary['overall_status'] == 'MINOR_ISSUES':
            exit(2)
        else:
            exit(0)
            
    except Exception as e:
        print(f"❌ FATAL ERROR: {str(e)}")
        exit(1)

if __name__ == "__main__":
    main()