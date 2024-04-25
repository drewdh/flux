import { useEffect, useRef } from 'react';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import {
  $createTextNode,
  $getRoot,
  COMMAND_PRIORITY_CRITICAL,
  KEY_ENTER_COMMAND,
  LexicalEditor,
} from 'lexical';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';

import ErrorBoundary from 'common/error-boundary';
import styles from './styles.module.scss';

function PlainText({ placeholder, onChange, value }: PlainTextProps) {
  const editorRef = useRef<LexicalEditor>(null);

  useEffect(() => {
    editorRef.current?.update(() => {
      const root = $getRoot();
      root.clear();
      // TODO: Not sure why this is needed to clear value
      if (value.length) {
        const textNode = $createTextNode(value);
        root.append(textNode);
      }
    });
  }, [value]);

  useEffect(() => {
    const unsubscribe = editorRef.current?.registerTextContentListener(() => {
      editorRef.current?.getEditorState().read(() => {
        const currentText = $getRoot().getTextContent();
        if (currentText !== value) {
          onChange(currentText);
        }
      });
    });
    return () => unsubscribe?.();
  }, [value, onChange]);

  return (
    <>
      <PlainTextPlugin
        contentEditable={<ContentEditable className={styles.input} />}
        placeholder={<div className={styles.placeholder}>{placeholder}</div>}
        // @ts-ignore
        ErrorBoundary={ErrorBoundary}
      />
      <EditorRefPlugin editorRef={editorRef} />
    </>
  );
}

export default function ChatBox({ placeholder, onSubmit, onChange, value }: ChatBoxProps) {
  const editorRef = useRef<LexicalEditor>(null);

  useEffect(() => {
    editorRef.current?.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        event.preventDefault();
        onSubmit($getRoot().getTextContent());
        // Return true to stop propagation
        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [onSubmit]);

  const lexicalConfig: InitialConfigType = {
    namespace: 'chat',
    onError: () => {},
    theme: {
      paragraph: styles.paragraph,
    },
  };

  return (
    <div className={styles.wrapper}>
      <LexicalComposer initialConfig={lexicalConfig}>
        <PlainText value={value} onChange={onChange} placeholder={placeholder} />
        <EditorRefPlugin editorRef={editorRef} />
      </LexicalComposer>
    </div>
  );
}

interface PlainTextProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}
interface ChatBoxProps {
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  value: string;
}
