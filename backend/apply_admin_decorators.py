#!/usr/bin/env python3
"""
Script untuk menerapkan decorator @admin_required ke semua endpoint admin
"""

import re

def apply_admin_decorators():
    """Apply @admin_required decorator to all admin endpoints"""
    
    # Read the current app.py file
    with open('app.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # List of admin endpoints that need the decorator
    admin_endpoints = [
        r"(@app\.route\('/api/admin/reports/annual', methods=\['GET'\]\)\s*\ndef get_annual_report\(\):)",
        r"(@app\.route\('/api/admin/policies', methods=\['GET'\]\)\s*\ndef get_admin_policies\(\):)",
        r"(@app\.route\('/api/admin/policies/stats', methods=\['GET'\]\)\s*\ndef get_policy_stats\(\):)",
        r"(@app\.route\('/api/admin/polls', methods=\['GET'\]\)\s*\ndef get_admin_polls\(\):)",
        r"(@app\.route\('/api/admin/polls/stats', methods=\['GET'\]\)\s*\ndef get_poll_stats\(\):)",
        r"(@app\.route\('/api/admin/polls/<int:poll_id>/results', methods=\['GET'\]\)\s*\ndef get_poll_results\([^)]*\):)",
        r"(@app\.route\('/api/admin/reports/chatbot', methods=\['GET'\]\)\s*\ndef get_chatbot_report\(\):)",
        r"(@app\.route\('/api/admin/reports/polling', methods=\['GET'\]\)\s*\ndef get_polling_report\(\):)",
        r"(@app\.route\('/api/admin/users/stats', methods=\['GET'\]\)\s*\ndef get_user_stats\(\):)",
        r"(@app\.route\('/api/admin/polls/<int:poll_id>', methods=\['PUT'\]\)\s*\ndef update_poll\([^)]*\):)",
        r"(@app\.route\('/api/admin/polls/<int:poll_id>', methods=\['DELETE'\]\)\s*\ndef delete_poll\([^)]*\):)",
        r"(@app\.route\('/api/admin/policies/<int:policy_id>', methods=\['PUT'\]\)\s*\ndef update_policy\([^)]*\):)",
        r"(@app\.route\('/api/admin/policies/<int:policy_id>', methods=\['DELETE'\]\)\s*\ndef delete_policy\([^)]*\):)"
    ]
    
    # Apply decorator to each endpoint
    for pattern in admin_endpoints:
        # Check if decorator is already applied
        decorator_pattern = r"@admin_required\s*\n" + pattern
        if not re.search(decorator_pattern, content, re.MULTILINE | re.DOTALL):
            # Apply the decorator
            content = re.sub(pattern, r"\1\n@admin_required", content, flags=re.MULTILINE | re.DOTALL)
            print(f"Applied @admin_required decorator to endpoint matching: {pattern[:50]}...")
    
    # Write the updated content back
    with open('app.py', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ All admin decorators applied successfully!")

if __name__ == "__main__":
    apply_admin_decorators()