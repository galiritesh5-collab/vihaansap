import os

def patch_file(filepath, imports_addition, hook_addition, hook_anchor, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if imports_addition and imports_addition not in content:
            if 'import { useBrandingConfig }' not in content:
                content = content.replace("import { Link", f"{imports_addition}\nimport {{ Link")

        if hook_addition and hook_addition not in content:
            content = content.replace(hook_anchor, f"{hook_addition}\n  {hook_anchor}")

        for old, new in replacements:
            content = content.replace(old, new)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    except Exception as e:
        print(f"Error patching {filepath}: {e}")

# Navbar
patch_file(
    'frontend/src/components/layout/Navbar.tsx',
    '',
    'const { config } = useBrandingConfig();',
    'const { currentUser',
    [
        ('src="/header-logo.png"', 'src={config?.headerLogoUrl || "/header-logo.png"}')
    ]
)

# AdminLayout
patch_file(
    'frontend/src/admin/components/AdminLayout.tsx',
    '',
    '', # AdminLayout already uses config
    '',
    [
        ('src="/footer-logo.png"', 'src={brandingConfig?.adminPortalLogoUrl || "/footer-logo.png"}')
    ]
)

# StudentLayout
patch_file(
    'frontend/src/student/layout/StudentLayout.tsx',
    '',
    '', # StudentLayout already uses config
    '',
    [
        ('src="/footer-logo.png"', 'src={brandingConfig?.studentPortalLogoUrl || "/footer-logo.png"}')
    ]
)

# Footer
patch_file(
    'frontend/src/components/layout/Footer.tsx',
    '',
    'const { config } = useBrandingConfig();',
    'const currentYear = new Date().getFullYear();',
    [
        ('src="/footer-logo.png"', 'src={config?.footerLogoUrl || "/footer-logo.png"}')
    ]
)

# About
patch_file(
    'frontend/src/pages/About.tsx',
    "import { useBrandingConfig } from '../hooks/useBrandingConfig';",
    'const { config } = useBrandingConfig();',
    'useEffect(() => {',
    [
        ('src={mentorImage}', 'src={config?.aboutMentorPhotoUrl || mentorImage}')
    ]
)
