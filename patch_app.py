import re

with open('frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Make Home eagerly loaded
content = content.replace("const Home = lazy(() => import('./pages/Home'));", "import Home from './pages/Home';")

with open('frontend/src/App.tsx', 'w') as f:
    f.write(content)
