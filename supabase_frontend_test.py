#!/usr/bin/env python3
"""
Test Supabase integration by simulating the frontend API call
"""

import os
import requests
import json
import time

def load_env_vars():
    """Load environment variables from .env.local file"""
    env_file = '/app/.env.local'
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

def test_supabase_frontend_integration():
    """Test the exact same query that the frontend useProducts hook makes"""
    load_env_vars()
    
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_anon_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    if not all([supabase_url, supabase_anon_key]):
        print("❌ Missing Supabase environment variables")
        return False
    
    headers = {
        'apikey': supabase_anon_key,
        'Authorization': f'Bearer {supabase_anon_key}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    }
    
    print("🧪 Testing Supabase Frontend Integration...")
    print("=" * 50)
    
    # Test 1: Basic connection
    try:
        response = requests.get(f"{supabase_url}/rest/v1/", headers=headers, timeout=5)
        print(f"✅ Basic connection: {response.status_code}")
    except Exception as e:
        print(f"❌ Basic connection failed: {e}")
        return False
    
    # Test 2: Categories query
    try:
        response = requests.get(
            f"{supabase_url}/rest/v1/categories",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            categories = response.json()
            print(f"✅ Categories query: {len(categories)} categories found")
        else:
            print(f"❌ Categories query failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Categories query error: {e}")
        return False
    
    # Test 3: Products query (exact same as useProducts hook)
    try:
        start_time = time.time()
        response = requests.get(
            f"{supabase_url}/rest/v1/products",
            headers=headers,
            params={
                'select': '*,category:categories(name,slug)',
                'is_active': 'eq.true',
                'order': 'created_at.desc'
            },
            timeout=15
        )
        end_time = time.time()
        
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products query: {len(products)} products found in {end_time - start_time:.2f}s")
            
            # Check data quality
            if products:
                first_product = products[0]
                print(f"   Sample product: {first_product.get('name', 'No name')}")
                print(f"   Has category: {'category' in first_product}")
                print(f"   Category data: {first_product.get('category', 'None')}")
                print(f"   Price: {first_product.get('price', 'No price')}")
                print(f"   Stock: {first_product.get('stock', 'No stock')}")
                print(f"   Seller name: {first_product.get('seller_name', 'No seller_name')}")
                
                # Check if all required fields are present
                required_fields = ['id', 'name', 'price', 'category_id', 'rating', 'stock']
                missing_fields = [field for field in required_fields if field not in first_product]
                if missing_fields:
                    print(f"⚠️  Missing fields: {missing_fields}")
                else:
                    print("✅ All required fields present")
            
            return True
        else:
            print(f"❌ Products query failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Products query timed out (>15s)")
        return False
    except Exception as e:
        print(f"❌ Products query error: {e}")
        return False

def main():
    success = test_supabase_frontend_integration()
    
    if success:
        print("\n🎉 Supabase integration is working correctly!")
        print("The issue might be in the frontend React component or state management.")
    else:
        print("\n💥 Supabase integration has issues that need to be fixed.")
    
    return success

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)