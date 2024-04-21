import { useEffect, useRef } from 'react';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import {
  $getRoot,
  COMMAND_PRIORITY_EDITOR,
  EditorState,
  KEY_ENTER_COMMAND,
  LexicalEditor,
} from 'lexical';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import ErrorBoundary from 'common/error-boundary';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';

import styles from './styles.module.scss';

export default function ChatBox({ placeholder, onChange, onSubmit }: Props) {
  const editorRef = useRef<LexicalEditor>(null);

  function handleChange(editorState: EditorState, editor: LexicalEditor, tags: Set<string>) {
    editorState.read(() => {
      const text = $getRoot().getTextContent();
      onChange(text);
    });
  }

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        event.preventDefault();
        onSubmit($getRoot().getTextContent());
        // Return true to stop propagation
        return true;
      },
      COMMAND_PRIORITY_EDITOR
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
        <PlainTextPlugin
          contentEditable={<ContentEditable className={styles.input} />}
          placeholder={<div className={styles.placeholder}>{placeholder}</div>}
          // @ts-ignore
          ErrorBoundary={ErrorBoundary}
        />
        <EditorRefPlugin editorRef={editorRef} />
        <OnChangePlugin onChange={handleChange} />
      </LexicalComposer>
    </div>
  );
}

interface Props {
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}
