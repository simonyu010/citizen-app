import React from 'react'

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>Citizen Flashcards App</h1>
            </header>
            <main className="layout-main">
                {children}
            </main>
            <footer className="layout-footer">
                <p>&copy; 2023 Citizen Flashcards App</p>
            </footer>
        </div>
    );
};

export default Layout;