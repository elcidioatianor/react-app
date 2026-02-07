// src/components/LoadingOverlay.jsx
export const LoadingOverlay = ({ isLoading, message = 'Carregando...' }) => {
    if (!isLoading) return null;

    return (
        <div className='loading-overlay'>
            <div className='loading-spinner'>
                <div className='spinner'></div>
                {message && <p className='loading-message'>{message}</p>}
            </div>
        </div>
    );
};

//TODO: ADD POSITION PROP: CENTER, TOP, BOTTOM
