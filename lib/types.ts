// Core type definitions for the video production app

export type IdeaStatus = 'raw' | 'researching' | 'approved';
export type VideoSection = 'hook' | 'value' | 'cta';
export type AssetType = 'video' | 'image' | 'audio';
export type ViewMode = 'kanban' | 'canvas';
export type TimelineTrack = 'video' | 'audio' | 'overlay';
export type RepurposingPlatform = 'shorts' | 'tiktok' | 'reel' | 'twitter';
export type ShotType = 'talking-head' | 'b-roll' | 'screen-recording';

// Repurposing & Advanced Features
export interface HookFramework {
  id: string;
  name: string;
  formula: string;
  example: string;
  purpose: string; // "Ne işe yarar"
  category: string;
}

export interface RepurposingClip {
  id: string;
  timelineSectionId?: string; // Reference to timeline section
  startTime: number;
  endTime: number;
  platforms: RepurposingPlatform[];
  customTitle?: string;
  notes?: string;
  status: 'planned' | 'exported' | 'published';
  createdAt: Date;
}

export interface ShotListItem {
  id: string;
  title: string;
  shotType: ShotType;
  timelineSectionId?: string;
  duration: number;
  notes?: string;
  completed: boolean;
  order: number;
}

export interface YouTubePreviewVariant {
  id: string;
  title: string;
  thumbnailUrl?: string;
  description?: string;
}

export interface PacingMetrics {
  wordCount: number;
  characterCount: number;
  estimatedDuration: number; // seconds
  wordsPerMinute: number;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  sceneId?: string; // null if in inbox
  position?: { x: number; y: number }; // for canvas view
  order?: number; // for kanban view
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  order: number;
  ideas: string[]; // idea IDs
  assets: string[]; // asset IDs
  todos: string[]; // todo IDs
  timeline?: TimelineSection[]; // Legacy support
  timelineItems?: TimelineItem[]; // New professional timeline
  duration?: number; // Total video duration in seconds
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineSection {
  type: VideoSection;
  startTime: number; // seconds
  endTime: number; // seconds
  notes: string;
  repurposingClips?: string[]; // IDs of RepurposingClip
  wordCount?: number;
  estimatedDuration?: number; // calculated from word count
}

export interface TimelineItem {
  id: string;
  track: TimelineTrack;
  assetId?: string; // Reference to Asset if applicable
  startTime: number; // seconds
  duration: number; // seconds
  type: 'hook' | 'value' | 'cta' | 'asset';
  label?: string;
  notes?: string;
  color?: string;
}

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  url: string;
  thumbnail?: string;
  notes?: string;
  sceneId?: string;
  createdAt: Date;
}

export interface TodoTemplate {
  id: string;
  name: string;
  subtasks: string[];
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  subtasks: SubTask[];
  sceneId?: string;
  createdAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ThumbnailIdea {
  id: string;
  imageUrl?: string;
  description: string;
  notes?: string;
}

export interface VideoMetadata {
  titles: string[];
  thumbnails: ThumbnailIdea[];
  tags: string[];
  notes: string;
  abTestVariants?: YouTubePreviewVariant[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ideas: Idea[];
  scenes: Scene[];
  assets: Asset[];
  todos: Todo[];
  metadata: VideoMetadata;
  repurposingClips: RepurposingClip[];
  shotList: ShotListItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Preset TODO templates
export const TODO_TEMPLATES: TodoTemplate[] = [
  {
    id: 'equipment',
    name: 'Ekipman Kontrolü',
    subtasks: [
      'Kamera batarya kontrolü',
      'SD kart formatla',
      'Işık ekipmanı test',
      'Mikrofon bağlantısı',
      'Tripod hazırla'
    ]
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail Çekimi',
    subtasks: [
      'Arka plan hazırla',
      'Işık düzeni ayarla',
      'Farklı pozlar dene (min 5)',
      'Yüz ifadesi varyasyonları',
      'Props kullan'
    ]
  },
  {
    id: 'b-roll',
    name: 'B-Roll Toplama',
    subtasks: [
      'Ana konu B-roll listesi yap',
      'Stok video araştır',
      'Kendi B-roll çek',
      'Çekim açıları planla',
      'Transition planla'
    ]
  },
  {
    id: 'editing',
    name: 'Kurgu Süreci',
    subtasks: [
      'Ana edit timeline oluştur',
      'B-roll ekle',
      'Müzik seç ve ekle',
      'SFX ekle',
      'Color grading',
      'Thumbnail oluştur'
    ]
  },
  {
    id: 'upload',
    name: 'Yükleme Hazırlığı',
    subtasks: [
      'Video export',
      'Başlık finalize et',
      'Açıklama yaz',
      'Taglar belirle',
      'Thumbnail upload',
      'End screen ayarla'
    ]
  }
];

// Color presets for sticky notes
export const IDEA_COLORS = [
  '#fef3c7', // yellow
  '#fecaca', // red
  '#d1fae5', // green
  '#ddd6fe', // purple
  '#bfdbfe', // blue
  '#fed7aa', // orange
  '#fbcfe8', // pink
  '#a7f3d0', // emerald
];

// Hook Framework Templates
export const HOOK_FRAMEWORKS: HookFramework[] = [
  {
    id: 'wrong-truth',
    name: 'Yanlış Bilinen Doğru',
    formula: 'Herkes X sanıyor ama gerçek Y.',
    example: 'Çoğu kişi yapay zekânın en büyük maliyetinin GPU olduğunu sanıyor. Asıl maliyet bambaşka bir yerde.',
    purpose: 'İzleyicinin zihninde küçük bir alarm çalar. "Demek bildiğim şey yanlış olabilir."',
    category: 'Merak'
  },
  {
    id: 'what-you-learn',
    name: 'Bugün Öğreneceğin Şey',
    formula: 'Bu videonun sonunda X\'i net bir şekilde anlayacaksın.',
    example: 'Bu videonun sonunda bir SaaS fikrinin gerçekten para kazandırıp kazandırmayacağını nasıl test edeceğini net olarak bileceksin.',
    purpose: 'Eğitim içeriği için altın standart. Net vaat = güven.',
    category: 'Eğitim'
  },
  {
    id: 'ignored-detail',
    name: 'Görmezden Gelinen Detay',
    formula: 'Kimsenin konuşmadığı ama X\'i belirleyen şey…',
    example: 'AI projelerinde kimsenin konuşmadığı ama başarının kaderini belirleyen tek bir metrik var.',
    purpose: '"İçeriden bilgi" hissi verir. İzleyici ayrıcalıklı hissetmek ister.',
    category: 'İçgörü'
  },
  {
    id: 'if-you-do',
    name: 'Eğer X Yapıyorsan',
    formula: 'Eğer X yapıyorsan, bu videoyu atlama.',
    example: 'Eğer YouTube\'da eğitim içeriği üretiyorsan ve izlenmeler artmıyorsa, bu videoyu atlama.',
    purpose: 'Hedefleme yapar. Yanlış izleyici kendini eler, doğru izleyici kilitlenir.',
    category: 'Hedefleme'
  },
  {
    id: 'save-time',
    name: 'Zaman Kazandırma',
    formula: 'X\'i denemek için aylar harcamana gerek yok.',
    example: 'Bir iş fikrinin tutup tutmayacağını anlamak için aylar harcamana gerek yok. Bunu bir haftada test edebilirsin.',
    purpose: 'Zaman, en kıymetli para birimi. Bu kanca doğrudan ona oynar.',
    category: 'Verimlilik'
  },
  {
    id: 'i-was-wrong',
    name: 'Ben de Yanıldım',
    formula: 'Ben uzun süre X sandım ama yanılıyormuşum.',
    example: 'Uzun süre iyi bir ürünün kendiliğinden büyüyeceğini sandım. Gerçekte olan çok farklıydı.',
    purpose: 'Ego değil öğrenme sunar. Eğitim içeriklerinde güveni artırır.',
    category: 'Deneyim'
  },
  {
    id: 'simple-effective',
    name: 'Basit Ama Etkili',
    formula: 'X düşündüğünden çok daha basit.',
    example: 'Bir AI projesini ölçeklemek düşündüğünden çok daha basit. Zor olan başka bir şey.',
    purpose: 'Korkuyu düşürür, merakı artırır.',
    category: 'Basitleştirme'
  },
  {
    id: 'happening-now',
    name: 'Şu Anda Oluyor',
    formula: 'Şu anda X alanında sessiz bir değişim oluyor.',
    example: 'Şu anda yapay zekâ dünyasında sessiz bir değişim oluyor ve çoğu kişi bunu fark etmiyor.',
    purpose: 'Güncellik + fırsat hissi.',
    category: 'Güncellik'
  },
  {
    id: 'concrete-result',
    name: 'Somut Sonuç',
    formula: 'X yaptığında Y olur.',
    example: 'Bu üç metriği takip ettiğinde SaaS projelerinin neden battığını net şekilde görüyorsun.',
    purpose: 'Belirsiz bilgi değil, sonuç vaadi.',
    category: 'Sonuç'
  },
  {
    id: 'what-this-is-not',
    name: 'Bu Video Ne Değil',
    formula: 'Bu video X değil.',
    example: 'Bu video "zengin ol" motivasyonu değil. Gerçek verilerle çalışan bir analiz.',
    purpose: 'Yanlış beklentiyi baştan keser, doğru kitleyi toplar.',
    category: 'Netleştirme'
  },
  {
    id: 'comparison',
    name: 'Karşılaştırma',
    formula: 'X ile Y arasındaki fark sanılandan büyük.',
    example: 'AI kullanan bir ürünle AI üzerine kurulu bir ürün arasındaki fark sandığından çok daha büyük.',
    purpose: 'Zihinsel netlik vaadi sunar.',
    category: 'Analiz'
  },
  {
    id: 'common-mistake',
    name: 'Bu Hata Herkesin Başına Geliyor',
    formula: 'X yaparken herkes aynı hatayı yapıyor.',
    example: 'Yeni YouTuber\'ların %90\'ı kancayı yanlış yerde kullanıyor.',
    purpose: 'Suçlama yok, ortak insanlık hali var.',
    category: 'Ortak Deneyim'
  }
];

// Pacing Configuration
export const PACING_CONFIG = {
  wordsPerMinute: 150, // Conversational speaking rate
  characterCountWeight: 0.7, // Adjustment factor for character vs word count
  hookMaxSeconds: 30,
  optimalVideoDuration: 600, // 10 minutes
};

// Platform Specifications
export const PLATFORM_SPECS = {
  shorts: { maxDuration: 60, aspectRatio: '9:16', name: 'YouTube Shorts' },
  tiktok: { maxDuration: 180, aspectRatio: '9:16', name: 'TikTok' },
  reel: { maxDuration: 90, aspectRatio: '9:16', name: 'Instagram Reel' },
  twitter: { maxDuration: 140, aspectRatio: '16:9', name: 'Twitter/X' },
};
