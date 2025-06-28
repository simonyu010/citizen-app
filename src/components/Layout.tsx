import React from 'react'

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>鱼蛋妈妈的公民考试</h1>
            </header>
            <main className="layout-main">
                {children}
            </main>
            <footer className="layout-footer">
                <p>&copy; 2025 鱼蛋妈妈的公民考试</p>
            </footer>
        </div>
    );
};

export default Layout;