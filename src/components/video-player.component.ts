import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #container
      class="relative rounded-2xl overflow-hidden bg-safs-dark transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      [class.opacity-0]="!isVisible()"
      [class.opacity-100]="isVisible()"
      [style.transform]="isVisible() ? 'translateY(0)' : 'translateY(24px)'"
    >
      <div class="relative bg-safs-dark rounded-2xl overflow-hidden shadow-2xl aspect-video">
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>

        <video
          #videoPlayer
          class="absolute inset-0 w-full h-full object-cover"
          [muted]="isMuted()"
          [loop]="loop"
          playsinline
          [preload]="autoplay ? 'auto' : 'none'"
          (click)="togglePlay()"
          (timeupdate)="onTimeUpdate()"
          (loadedmetadata)="onLoadedMetadata()"
          (ended)="onEnded()"
        ></video>



        <div
          class="absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300"
          [class.opacity-0]="!controlsVisible() && isPlaying()"
          [class.opacity-100]="controlsVisible() || !isPlaying()"
        >
          <div class="px-4 sm:px-6 pb-4 sm:pb-5">
            <div class="flex items-center gap-3 sm:gap-4">
              <button
                (click)="togglePlay()"
                class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 bg-white/15 hover:bg-white/25 backdrop-blur-sm"
                aria-label="Toggle Play"
              >
                @if (isPlaying()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="text-white ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                }
              </button>

              <div class="relative flex-1 h-1 sm:h-1.5 rounded-full bg-white/20 cursor-pointer group" (click)="seek($event)">
                <div
                  class="absolute left-0 top-0 h-full rounded-full bg-safs-gold transition-all duration-100"
                  [style.width.%]="progress()"
                ></div>
                <div
                  class="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-safs-gold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  [style.left.%]="progress()"
                  [style.marginLeft]="'-6px'"
                ></div>
              </div>

              <span class="text-xs text-white/70 font-mono tabular-nums flex-shrink-0 min-w-[80px] text-right">
                {{ currentTime() }} / {{ duration() }}
              </span>

              <button
                (click)="toggleMute()"
                class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 bg-white/15 hover:bg-white/25 backdrop-blur-sm"
                aria-label="Toggle Mute"
              >
                @if (isMuted()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M11 5 6 9H2v6h4l5 4z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @Input() src = '';
  @Input() loop = false;
  @Input() startMuted = true;
  @Input() autoplay = true;

  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;

  isInView = signal(false);
  isVisible = signal(false);
  isPlaying = signal(false);
  isMuted = signal(true);
  isEnded = signal(false);
  hasStarted = signal(false);
  controlsVisible = signal(false);
  progress = signal(0);
  currentTime = signal('0:00');
  duration = signal('0:00');

  private videoEl: HTMLVideoElement | null = null;
  private observer: IntersectionObserver | null = null;
  private controlsTimer: ReturnType<typeof setTimeout> | null = null;
  private entryTimer: ReturnType<typeof setTimeout> | null = null;
  private visibilityObserver: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.videoEl = this.videoPlayerRef?.nativeElement;
    if (!this.videoEl) return;

    this.isMuted.set(this.startMuted);

    this.videoEl.src = this.src;

    if (this.autoplay) {
      this.videoEl.muted = true;
      this.videoEl.play().then(() => {
        this.isPlaying.set(true);
        this.hasStarted.set(true);
      }).catch(() => {
        this.hasStarted.set(true);
      });
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isInView.set(true);
          this.observer?.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });

    if (this.videoEl) {
      this.observer.observe(this.videoEl);
    }

    this.visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.entryTimer = setTimeout(() => {
            this.isVisible.set(true);
          }, 100);
          this.visibilityObserver?.disconnect();
        }
      });
    }, { threshold: 0.05 });

    if (this.containerRef?.nativeElement) {
      this.visibilityObserver.observe(this.containerRef.nativeElement);
    }

    this.videoEl.addEventListener('mouseenter', () => this.showControls());
    this.videoEl.addEventListener('mousemove', () => this.showControls());
    this.videoEl.addEventListener('mouseleave', () => this.hideControls());
    this.videoEl.addEventListener('touchstart', () => this.toggleControls());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.visibilityObserver?.disconnect();
    if (this.controlsTimer) clearTimeout(this.controlsTimer);
    if (this.entryTimer) clearTimeout(this.entryTimer);
    this.videoEl?.pause();
  }

  togglePlay(): void {
    if (!this.videoEl) return;
    if (this.isEnded()) {
      this.videoEl.currentTime = 0;
      this.isEnded.set(false);
    }
    if (this.isPlaying()) {
      this.videoEl.pause();
      this.isPlaying.set(false);
      this.showControls();
    } else {
      this.videoEl.play();
      this.isPlaying.set(true);
      this.hasStarted.set(true);
      this.hideControls();
    }
  }

  toggleMute(): void {
    if (!this.videoEl) return;
    this.videoEl.muted = !this.videoEl.muted;
    this.isMuted.set(this.videoEl.muted);
  }

  seek(event: MouseEvent): void {
    if (!this.videoEl) return;
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.videoEl.currentTime = pos * this.videoEl.duration;
  }

  onTimeUpdate(): void {
    if (!this.videoEl || !this.videoEl.duration) return;
    this.progress.set((this.videoEl.currentTime / this.videoEl.duration) * 100);
    this.currentTime.set(this.formatTime(this.videoEl.currentTime));
  }

  onLoadedMetadata(): void {
    if (!this.videoEl) return;
    this.duration.set(this.formatTime(this.videoEl.duration));
  }

  onEnded(): void {
    this.isPlaying.set(false);
    this.isEnded.set(true);
    this.showControls();
  }

  private showControls(): void {
    this.controlsVisible.set(true);
    if (this.controlsTimer) clearTimeout(this.controlsTimer);
    if (this.isPlaying()) {
      this.controlsTimer = setTimeout(() => {
        this.controlsVisible.set(false);
      }, 3000);
    }
  }

  private hideControls(): void {
    if (this.isPlaying()) {
      this.controlsTimer = setTimeout(() => {
        this.controlsVisible.set(false);
      }, 2000);
    }
  }

  private toggleControls(): void {
    this.controlsVisible.update(v => !v);
    if (this.controlsTimer) clearTimeout(this.controlsTimer);
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
