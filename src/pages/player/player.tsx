import React, {
  MouseEventHandler,
  PropsWithChildren,
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
  const [muted, setMuted] = useState<boolean>(player.current?.getMuted());
  const overlayRef = useRef<HTMLDivElement>(null);
  const isOverlayHovered = useHover(overlayRef);
  const [isInteractiveHovered, setIsInteractiveHovered] = useState<boolean>(false);
  const idleMs = 3000;
  const idleTimer = useRef<number>();
  const overlayVisible = isInteractiveHovered || (isOverlayHovered && !isIdle) || paused;

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
      player.current?.setMuted(false);
      setPaused(false);
    });
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.PAUSE, () => {
      setPaused(true);
    });
    // @ts-ignore
    player.current?.addEventListener(Twitch.Player.READY, () => {
      (document.querySelector('#twitch-player iframe') as HTMLIFrameElement)?.focus();
      player.current?.play();
      player.current?.setMuted(false);
    });
    // return () => (player = undefined);
  }, [options]);

  return (
    <div
      ref={overlayRef}
      className={styles.wrapper}
      onClick={togglePlayback}
      onMouseMove={() => {
        if (!isOverlayHovered) {
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
        <Interactive>
          <IconButton onClick={toggleMuted} iconName={muted ? 'audio-off' : 'audio-full'} />
        </Interactive>
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
