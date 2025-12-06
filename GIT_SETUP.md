# Git Setup & Push to GitHub

## ⚠️ IMPORTANT: Before Pushing

Make sure `.env` files are NOT tracked by Git!

### Check .gitignore
The `.gitignore` file should include:
```
.env
backend/.env
frontend/.env
```

## 🚀 Push to GitHub

### Step 1: Initialize Git (if not already done)
```bash
git init
```

### Step 2: Add all files
```bash
git add .
```

### Step 3: Commit
```bash
git commit -m "Initial commit: PetConnect platform with all features"
```

### Step 4: Add remote repository
```bash
git remote add origin https://github.com/DEBA2003-BYTE/Pet-Connect.git
```

### Step 5: Set main branch
```bash
git branch -M main
```

### Step 6: Push to GitHub
```bash
git push -u origin main
```

## ✅ Verify

After pushing, check:
1. Go to https://github.com/DEBA2003-BYTE/Pet-Connect
2. Verify `.env` files are NOT visible
3. Check README.md displays correctly
4. Verify all code is uploaded

## 🔐 Security Checklist

Before pushing, ensure:
- [ ] `.env` is in `.gitignore`
- [ ] No passwords in code
- [ ] No API keys in code
- [ ] `.env.example` has placeholder values only

## 📝 Future Commits

For future updates:
```bash
git add .
git commit -m "Description of changes"
git push
```

## 🌿 Branching Strategy

For new features:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push feature branch
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
```

## 🔄 Pull Latest Changes

```bash
git pull origin main
```

## 📊 Check Status

```bash
git status
git log --oneline
```

## 🚨 If .env Was Accidentally Committed

If you accidentally committed `.env`:

```bash
# Remove from Git but keep local file
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git commit -m "Remove .env files from tracking"

# Push
git push
```

## 📦 What Gets Pushed

✅ **Included:**
- All source code
- Documentation
- Configuration files (.example)
- Package.json files
- README.md

❌ **Excluded:**
- .env files
- node_modules/
- dist/ build/
- .DS_Store
- IDE files

## 🎉 Success!

Your code is now on GitHub and ready for:
- Collaboration
- Deployment
- Version control
- Backup

---

**Repository:** https://github.com/DEBA2003-BYTE/Pet-Connect
