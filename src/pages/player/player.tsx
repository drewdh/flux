import React, {
  MouseEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon, { IconProps } from '@cloudscape-design/components/icon';
import clsx from 'clsx';
import { useHover } from 'usehooks-ts';

import styles from './player.module.scss';

export default function Player({ username }: PlayerProps) {
  const player = useRef<any>(null);
  const [paused, setPaused] = useState<boolean>(false);
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>();
  const [audioDisabled, setAudioDisabled] = useState<boolean>(true);
  const [playbackStarted, setPlaybackStarted] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isWrapperHovered = useHover(wrapperRef);
  const [isInteractiveHovered, setIsInteractiveHovered] = useState<boolean>(false);
  const idleMs = 3000;
  const idleTimer = useRef<number>();
  const overlayVisible = isInteractiveHovered || (isWrapperHovered && !isIdle) || paused;

  // Force player to update channel when URL changes
  useEffect(() => {
    player.current?.setChannel(username);
  }, [username]);

  const options = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      channel: username,
      autoplay: true,
      muted: false,
      controls: false,
    }),
    [username]
  );

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      return document.exitFullscreen();
    }
    try {
      await wrapperRef.current?.requestFullscreen();
    } catch (_error) {
      console.error('Failed to enter fullscreen.');
    }
  }

  function Interactive({ children }: PropsWithChildren) {
    return (
      <div
        onMouseEnter={() => setIsInteractiveHovered(true)}
        onMouseLeave={() => setIsInteractiveHovered(false)}
      >
        {children}
      </div>
    );
  }

  function togglePlayback() {
    const isPaused = player.current?.isPaused();
    if (isPaused) {
      player.current?.play();
    } else {
      player.current?.pause();
    }
    setPaused(!isPaused);
  }

  function toggleMuted() {
    setMuted((prev) => {
      player.current?.setMuted(!prev);
      return !prev;
    });
  }

  const keydownHandler = useCallback((event: KeyboardEvent): void => {
    const tagName = document.activeElement?.tagName;
    const isEditable =
      tagName === 'INPUT' ||
      tagName === 'TEXTAREA' ||
      (document.activeElement as HTMLElement)?.isContentEditable;
    if (isEditable) {
      return;
    }
    const handlers: Record<string, Function> = {
      k: togglePlayback,
      ' ': togglePlayback,
      m: toggleMuted,
      f: toggleFullscreen,
    };
    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keydownHandler);
    return () => document.removeEventListener('keydown', keydownHandler);
  }, [keydownHandler]);

  const clearIdle = () => {
    setIsIdle(false);
    clearTimeout(idleTimer.current);
  };

  const startIdleTimer = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      setIsIdle(true);
    }, idleMs);
  };

  useLayoutEffect(() => {
    if (!player.current) {
      // @ts-ignore
      player.current = new Twitch.Player('twitch-player', options);
    }
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.PLAY, () => {
      setPaused(false);
      /*
       * Check muted state after playback. If it's muted the first time the video plays,
       * even though we set it to play unmuted, then Twitch is likely showing the "Click
       * to unmute" overlay.
       */
      player.current?.setMuted(false);
      const nextMuted = player.current?.getMuted();
      setMuted(player.current?.getMuted());
      setAudioDisabled(!playbackStarted && nextMuted);
      setPlaybackStarted(true);
    });
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.PAUSE, () => {
      setPaused(true);
    });
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.READY, () => {
      player.current?.play();
    });
    // return () => (player = undefined);
  }, [options, playbackStarted]);

  return (
    <div
      ref={wrapperRef}
      className={clsx(styles.wrapper, document.fullscreenElement && styles.fullscreen)}
      onClick={togglePlayback}
      onMouseMove={() => {
        if (!isWrapperHovered) {
          return;
        }
        clearIdle();
        startIdleTimer();
      }}
      onMouseEnter={() => {
        clearIdle();
        startIdleTimer();
      }}
      onMouseLeave={() => {
        setIsIdle(false);
        clearTimeout(idleTimer.current);
      }}
    >
      <div id="twitch-player" className={styles.player} />
      <div className={clsx(styles.overlay, overlayVisible && styles.visible)} />
      <div className={clsx(styles.background, overlayVisible && styles.visible)} />
      <div
        className={clsx(styles.controls, overlayVisible && styles.visible)}
        onClick={(e) => e.stopPropagation()}
      >
        <Interactive>
          <IconButton onClick={togglePlayback} iconName={paused ? 'play' : 'pause'} />
        </Interactive>
        {!audioDisabled && (
          <Interactive>
            <IconButton onClick={toggleMuted} iconName={muted ? 'audio-off' : 'audio-full'} />
          </Interactive>
        )}
        <div className={styles.endControls}>
          <Interactive>
            <IconButton
              onClick={toggleFullscreen}
              iconName={document.fullscreenElement ? 'exit-full-screen' : 'full-screen'}
            />
          </Interactive>
        </div>
      </div>
    </div>
  );
}

interface IconButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  iconName: IconProps.Name;
}
function IconButton({ onClick, iconName }: IconButtonProps) {
  return (
    <button onClick={onClick} className={styles.iconButton}>
      <Icon name={iconName} size="inherit" />
    </button>
  );
}

interface PlayerProps {
  username: string | undefined;
}
