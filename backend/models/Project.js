import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot be more than 100 characters']
  },
  type: {
    type: String,
    default: 'Website',
    enum: ['Website', 'Web App', 'Mobile App', 'Dashboard', 'Landing Page', 'E-commerce', 'Portfolio', 'Desktop App', 'Custom']
  },
  canvas: {
    w: { type: Number, default: 1600 },
    h: { type: Number, default: 1000 }
  },
  assets: [{
    id: String,
    name: String,
    dataUrl: String,
    w: Number,
    h: Number
  }],
  devices: [{
    id: String,
    kind: String,
    name: String,
    x: Number,
    y: Number,
    w: Number,
    tilt: Number,
    color: String,
    assetId: String,
    fit: String,
    zoom: Number,
    panX: Number,
    panY: Number,
    shadow: String,
    url: String,
    visible: Boolean,
    brightness: Number,
    reflection: Number,
    radiusMul: Number,
    opacity: Number,
    material: String,
    z: Number
  }],
  background: {
    type: String,
    c1: String,
    c2: String,
    c3: String,
    angle: Number,
    pattern: String,
    patternOpacity: Number,
    style: String,
    seed: Number,
    light: {
      type: String,
      intensity: Number
    },
    meshPoints: Number,
    kind: String,
    image: mongoose.Schema.Types.Mixed
  },
  text: {
    enabled: Boolean,
    title: String,
    subtitle: String,
    showBadges: Boolean,
    badges: [String],
    position: String,
    scale: Number,
    color: String,
    autoColor: Boolean,
    fontFamily: String
  },
  logo: {
    enabled: Boolean,
    assetId: String,
    position: String,
    size: Number,
    opacity: Number
  },
  decoration: {
    set: String,
    seed: Number,
    intensity: Number,
    density: Number,
    layers: [mongoose.Schema.Types.Mixed]
  },
  accents: {
    a1: String,
    a2: String
  },
  thumbnail: String,
  exportCount: {
    type: Number,
    default: 0
  },
  decos: [mongoose.Schema.Types.Mixed],
  mood: String,
  icons: [mongoose.Schema.Types.Mixed],
  textboxes: [mongoose.Schema.Types.Mixed],
  canvasImages: [mongoose.Schema.Types.Mixed],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
projectSchema.index({ user: 1, updatedAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
