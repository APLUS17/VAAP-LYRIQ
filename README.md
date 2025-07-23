# Lyriq - AI-Assisted Lyric Writing App

A clean, mobile-first React Native app for songwriters to capture and organize their lyrical ideas.

## ✨ Features

### 🎵 **Core Functionality**
- **Lyric Editor**: Clean text editing with serif fonts for comfortable writing
- **Section Management**: Organize lyrics into Verse, Chorus, and Bridge sections
- **Collapsible Sections**: Expand/collapse sections for better organization
- **Persistent Storage**: Automatic saving with AsyncStorage
- **Section Selection**: Beautiful modal for choosing section types

### 🎨 **Design**
- **iOS-First**: Following Apple Human Interface Guidelines
- **Clean Typography**: Georgia serif font for lyric editing
- **Smooth Animations**: Built with react-native-reanimated v3
- **Mobile Optimized**: Responsive design for all screen sizes

### 🛠️ **Available Features** (Ready to integrate)
- **Mumble Recorder**: Audio recording for melody capture
- **AI Assistant**: OpenAI, Anthropic, and Grok integration for lyric suggestions
- **ChatGPT-Style Sidebar**: Professional navigation system

## 🚀 **Tech Stack**

- **React Native 0.76.7** with TypeScript
- **Expo SDK 53** for development and building
- **NativeWind + Tailwind CSS v3** for styling
- **Zustand** for state management
- **AsyncStorage** for persistent storage
- **React Navigation** for screen navigation
- **React Native Reanimated v3** for animations
- **Expo Vector Icons** for UI icons

## 📱 **Getting Started**

### Prerequisites
- Node.js (v16 or later)
- Bun (package manager)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lyriq-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start the development server**
   ```bash
   bun start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   bun run ios
   
   # Android  
   bun run android
   ```

## 🎯 **Usage**

1. **Launch the app** - See the "Lyriq" main screen
2. **Tap "CREATE SONG SECTION"** - Opens section selection modal
3. **Choose section type** - Select from Verse, Chorus, Bridge, or custom
4. **Start writing** - Begin crafting your lyrics
5. **Add more sections** - Use the + buttons to expand your song
6. **Auto-save** - Your lyrics are automatically saved locally

## 🏗️ **Project Structure**

```
├── App.tsx                 # Main app component (current implementation)
├── src/
│   ├── components/         # Reusable UI components
│   ├── screens/           # Screen components
│   ├── state/             # Zustand stores
│   ├── api/               # API integrations (AI services)
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
├── assets/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🔧 **Development**

### Key Commands
```bash
# Start development server
bun start

# Clear cache and restart
bun start --clear

# Run tests
bun test

# Build for production
bun run build
```

### Available Scripts
- `bun start` - Start Expo development server
- `bun run ios` - Run on iOS simulator
- `bun run android` - Run on Android emulator
- `bun run web` - Run in web browser

## 🤖 **AI Features** (Optional)

The app includes ready-to-use AI integrations:

- **OpenAI GPT-4** for lyric suggestions
- **Anthropic Claude** for creative writing assistance
- **Grok** for alternative AI responses

*Note: AI features are currently disabled to avoid API rate limits. Enable by updating environment variables.*

## 📚 **Libraries Used**

- `expo` - React Native development platform
- `react-navigation` - Navigation library
- `zustand` - State management
- `react-native-reanimated` - Animation library
- `react-native-gesture-handler` - Gesture handling
- `nativewind` - Tailwind CSS for React Native
- `expo-av` - Audio recording and playback
- `@expo/vector-icons` - Icon library

## 🎨 **Design System**

### Colors
- **Primary**: Gray-800 (#1F2937)
- **Secondary**: Gray-600 (#4B5563)
- **Accent**: Orange-500 (#F97316)
- **Background**: Gray-200 (#E5E7EB)
- **Text**: Gray-900 (#111827)

### Typography
- **Headlines**: System font, light weight
- **Body**: Georgia serif for lyric content
- **UI**: San Francisco (iOS) / Roboto (Android)

## 🚧 **Roadmap**

- [ ] Audio recording integration
- [ ] AI assistant features
- [ ] Cloud sync and backup
- [ ] Collaboration features
- [ ] Export to various formats
- [ ] Rhyme dictionary integration
- [ ] Chord progression suggestions

## 📄 **License**

This project is licensed under the MIT License.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 **Support**

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for songwriters everywhere**