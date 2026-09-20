import React from 'react';

export default function AlbumPage() {
  const videoId = '9-nICrDDtn0';

  const tracks = [
    "OUTRO",
    "EL MUNDO SE VA A ACABAR",
    "FOREVER TU GANTIEL",
    "Lakenoshi",
    "VAMOaCOCHI",
    "SUSU",
    "SIRENA",
    "GANTEL y BELLAKz",
    "SI ESTÁS CON ALGUIEN",
    "Dulces SueñoZzz (+INTERLUDIO)",
    "$UELTA GATITA $UELTA",
    "WHAT U NEED? (SexPlaylist 2)",
    "WO OH OH",
    "KOKO",
    "COMERNOS",
    "SKY",
    "MOONLIGHT",
    "POR SI MAÑANA NO ESTOY aqui "
  ];

  return (
    <div className="album-page">
      <section className="video-player-section">
        <h1>Omar Courtz - Por Si Mañana No Estoy</h1>
        
        <div className="video-container">
          <iframe
            width="100%"
            height="600"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Álbum Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

        <div className="video-info">
          <p>Disfruta del videoclip completo del álbum "Por Si Mañana No Estoy" de Omar Courtz.</p>
        </div>
      </section>

      <section className="tracks-section">
        <h2>18 Canciones del Álbum</h2>
        <div className="tracks-list">
          {tracks.map((track, index) => (
            <div key={index} className="track-card">
              <span className="track-number">{index + 1}</span>
              <span className="track-name">{track}</span>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .album-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .video-player-section {
          margin-bottom: 3rem;
        }

        .video-player-section h1 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .video-container {
          width: 100%;
          margin-bottom: 1rem;
        }

        .video-info {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .video-info p {
          margin: 0;
          color: #4b5563;
        }

        .tracks-section {
          background: #fafbfc;
          padding: 2rem;
          border-radius: 12px;
        }

        .tracks-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .tracks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .track-card {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .track-card:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .track-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          margin-right: 1rem;
        }

        .track-name {
          font-size: 1.1rem;
          color: #374151;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .album-page {
            padding: 1rem;
          }

          .video-player-section h1 {
            font-size: 1.8rem;
          }

          .video-container {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
