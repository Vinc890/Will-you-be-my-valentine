# 💝 Valentine's Day Proposal Website

A playful and interactive Valentine's Day proposal website built with React. Features a fun interaction where the "No" button runs away and the "Yes" button grows bigger, eventually leading to a beautiful celebration!

## ✨ Features

- 🎨 Beautiful Valentine's Day themed UI with gradient backgrounds
- 💕 Interactive "No" button that moves away when hovered/clicked
- 📈 "Yes" button that grows progressively larger
- 🎆 Celebration animations with flying hearts and fireworks
- 🔗 Shareable URLs with base64 encoded parameters
- 📱 Fully responsive design (mobile, tablet, laptop, desktop)
- 🖼️ Support for images and GIFs
- 📝 Custom messages and names

## 🖼️ Image Recommendations

### Image Resolution
- **Recommended:** Square images (500x500px to 1000x1000px)
- **Aspect Ratio:** 1:1 (square) works best
- **Format:** JPG, PNG, or GIF (GIF recommended for animated content)

### Image Sources
**Using URLs is STRONGLY RECOMMENDED** over file uploads because:
1. ✅ No file size limits
2. ✅ Easier to share links
3. ✅ Better performance
4. ✅ Images load directly from CDN
5. ✅ Works with animated GIFs seamlessly

### Where to Get Image URLs

1. **Tenor (Recommended for GIFs)**
   - Visit: https://tenor.com
   - Search for cute/romantic GIFs
   - Right-click on GIF → "Copy image address"
   - Use the URL (ends with .gif)

2. **Giphy**
   - Visit: https://giphy.com
   - Search for Valentine's/romantic GIFs
   - Click "Share" → "Copy GIF Link"
   - Use the media URL

3. **Imgur**
   - Visit: https://imgur.com
   - Upload your image
   - Right-click uploaded image → "Copy image address"

4. **Other Options**
   - Unsplash (free high-quality photos)
   - Pexels (free stock photos)
   - Your own image hosting

### Example URLs
```
First Image (asking): 
https://media.tenor.com/cute-puppy-example.gif

Success Image (celebration):
https://media.tenor.com/celebration-example.gif
```

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Step-by-Step Setup

1. **Extract/Navigate to Project Folder**
   ```bash
   cd valentine-proposal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install:
   - React 18.2.0
   - React DOM 18.2.0
   - Framer Motion 10.16.16 (for animations)
   - Vite 5.0.8 (build tool)
   - @vitejs/plugin-react 4.2.1

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will automatically open at `http://localhost:3000`

4. **Build for Production** (Optional)
   ```bash
   npm run build
   ```
   This creates an optimized build in the `dist` folder

5. **Preview Production Build** (Optional)
   ```bash
   npm run preview
   ```

## 📖 How to Use

### Creating a Proposal Link

1. When you first visit the site (without parameters), you'll see a form
2. Fill in the following details:
   - **Their Name:** The name of the person you're asking
   - **First Image URL:** A cute/romantic image or GIF for the proposal
   - **Success Image URL:** A celebration image/GIF shown after they say yes
   - **Success Message:** Your personalized message after they accept

3. Click "Generate Valentine Link"
4. The URL will update with encoded parameters
5. Copy and share this URL with your Valentine!

### Example Form Values

```
Name: Sarah
First Image: https://media.tenor.com/example-cute-puppy.gif
Success Image: https://media.tenor.com/example-celebration.gif
Message: Yay! I knew you'd say yes! Can't wait for our Valentine's date! 💕
```

### URL Structure

The generated URL looks like:
```
http://localhost:3000/?d=eyJuYW1lIjoiU2FyYWgiLCJpbWFnZTE...
```

The `d` parameter contains base64-encoded JSON with all the details.

## 🎮 How It Works

### The Interaction Flow

1. **Initial View:** 
   - Shows the first image/GIF
   - Displays "{Name}, Will you be my Valentine? 💝"
   - Two buttons: "Yes! 💕" and "No 😢"

2. **When They Try to Click "No":**
   - Button moves to a random nearby location (60-120px away)
   - "Yes" button grows 15% larger
   - "No" button can move anywhere on the screen (but stays visible)
   - "No" button never overlaps the "Yes" button

3. **When They Click "Yes" (First Time):**
   - Button text changes to "Are you Really Sure?"
   
4. **Second Click:**
   - Text changes to "Are you Really Really Sure?"
   
5. **Third Click:**
   - Text changes to "Are you Really Really Really Sure?"
   
6. **Fourth Click (Final):**
   - 🎆 Fireworks animation
   - 💕 Hearts flying upward
   - Image changes to success image
   - Shows your custom success message

## 📱 Responsive Design

The website is fully responsive and tested on:
- 📱 Mobile phones (320px - 480px)
- 📱 Tablets (481px - 768px)
- 💻 Laptops (769px - 1024px)
- 🖥️ Desktops (1025px - 1200px)
- 🖥️ Large monitors (1201px+)

All text sizes, button sizes, and spacing automatically adjust using `clamp()` CSS functions.

## 🎨 Customization

### Changing Colors

Edit `valentine-proposal.jsx` and modify the gradient colors:

```javascript
background: 'linear-gradient(135deg, #ffeef8 0%, #ffe0f0 25%, #ffd4eb 50%, #ffb6d9 75%, #ff9ec7 100%)'
```

### Changing Fonts

The project uses "Caveat" - a handwritten/casual font. To change:

1. Edit `src/index.css`
2. Replace the Google Fonts import
3. Update `fontFamily` throughout the component

### Adjusting Button Movement

In `valentine-proposal.jsx`, modify these values:

```javascript
const maxMove = 120;  // Maximum movement distance (pixels)
const minMove = 60;   // Minimum movement distance (pixels)
```

### Changing Yes Button Growth Rate

```javascript
setYesButtonSize(prev => Math.min(prev + 0.15, 3));
// Change 0.15 to adjust growth rate
// Change 3 to adjust maximum size
```

## 🐛 Troubleshooting

### Images Not Loading
- ✅ Make sure URLs are direct image links (end with .gif, .jpg, .png)
- ✅ Check that URLs are publicly accessible
- ✅ Try using Tenor or Giphy for reliable GIF hosting

### "No" Button Not Moving
- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Run on a different port
npm run dev -- --port 3001
```

## 📦 Project Structure

```
valentine-proposal/
├── src/
│   ├── valentine-proposal.jsx  # Main component
│   ├── App.jsx                 # App wrapper
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js             # Vite configuration
└── README.md                   # This file
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit https://vercel.com
3. Import your repository
4. Vercel auto-detects Vite
5. Click "Deploy"

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to https://app.netlify.com/drop

### Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy:
npm run deploy
```

## 💡 Tips for Best Results

1. **Use GIFs:** Animated GIFs make the proposal more engaging
2. **Test the Link:** Always test your generated link before sharing
3. **Short Messages:** Keep success messages concise and sweet
4. **Square Images:** Use square (1:1) images for best appearance
5. **Tenor/Giphy:** These platforms provide reliable, fast-loading GIFs

## 🎉 Example Scenarios

### Cute Puppy Theme
- First Image: Cute puppy with sad eyes
- Success Image: Happy puppy celebration
- Message: "Yay! You made the puppy happy! And me too! 💕"

### Romantic Theme
- First Image: Heart-shaped rose petals
- Success Image: Fireworks/celebration
- Message: "I can't wait to spend Valentine's Day with you! 🌹"

### Funny Theme
- First Image: Funny pleading face
- Success Image: Victory dance
- Message: "I knew my charm would work! Pizza and movies on Valentine's? 🍕"

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

---

Made with 💕 for Valentine's Day

**Good luck with your proposal! 💝**