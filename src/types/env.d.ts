interface Window {
    ENV?: {
        REACT_APP_API_KEY?: string;
        [key: string]: string | undefined;
    };
}

interface ImportMetaEnv {
    REACT_APP_API_KEY?: string;
    [key: string]: string | undefined;
}
