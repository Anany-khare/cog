import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api';
import Header from './Header';

const RecruitmentResponses = () => {
  const { recruitmentId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [recruitment, setRecruitment] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/v1/recruitment/${recruitmentId}/responses`);
        if (response.data.success) {
          setRecruitment(response.data.recruitment);
          setResponses(response.data.responses || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch responses');
      } finally {
        setLoading(false);
      }
    };

    if (recruitmentId) {
      fetchResponses();
    }
  }, [recruitmentId]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#111827', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ color: '#f97316', fontSize: '1.2rem' }}>Loading responses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#111827', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <div style={{ color: '#ef4444', fontSize: '1.2rem' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111827' }}>
      <Header />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '2rem',
        color: '#f9fafb'
      }}>
        {recruitment && (
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: '#f97316', fontSize: '2rem', marginBottom: '0.5rem' }}>
              {recruitment.game} - {recruitment.requirement}
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
              Posted by {recruitment.orgId?.username}
            </p>
            {recruitment.contactInfo && (
              <p style={{ color: '#38bdf8', fontSize: '1rem' }}>
                Contact: {recruitment.contactInfo}
              </p>
            )}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ color: '#f9fafb', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Applications ({responses.length})
          </h2>
        </div>

        {responses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            background: '#1f2937', 
            borderRadius: '1rem',
            border: '1px solid #374151'
          }}>
            <div style={{ color: '#9ca3af', fontSize: '1.2rem' }}>
              No applications received yet
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {responses.map((response, index) => (
              <div key={response._id || index} style={{
                background: '#1f2937',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #374151'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <img
                    src={response.gamerId?.profilepic || 'https://via.placeholder.com/50'}
                    alt="Profile"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '1rem',
                      border: '2px solid #f97316'
                    }}
                  />
                  <div>
                    <div style={{ color: '#f9fafb', fontSize: '1.1rem', fontWeight: '600' }}>
                      {response.gamerId?.username}
                    </div>
                    {response.gamerId?.location && (
                      <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                        📍 {response.gamerId.location}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    In-Game User ID
                  </div>
                  <div style={{ color: '#f9fafb', fontSize: '1rem' }}>
                    {response.inGameUserId}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Game Details & Experience
                  </div>
                  <div style={{ 
                    color: '#f9fafb', 
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {response.gameDetail}
                  </div>
                </div>

                {response.screenshotUrl && (
                  <div>
                    <div style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      Profile Card Screenshot
                    </div>
                    <img
                      src={response.screenshotUrl}
                      alt="Profile Card"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '0.5rem',
                        border: '1px solid #374151'
                      }}
                    />
                  </div>
                )}

                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #374151',
                  color: '#9ca3af',
                  fontSize: '0.8rem'
                }}>
                  Applied on {new Date(response.submittedAt).toLocaleDateString()} at {new Date(response.submittedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentResponses; 