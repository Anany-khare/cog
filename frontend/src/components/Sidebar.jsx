import React from 'react';
import { useSelector } from 'react-redux';
import './../assets/Sidebar.css';
import { motion } from 'framer-motion';
import { FaDiscord, FaTwitch, FaYoutube } from 'react-icons/fa';

const Sidebar = () => {
    const { user } = useSelector(store => store.auth);
    if (!user) return null;
    const showRanks = user.role !== 'org';
    return (
        <motion.aside
            className="sidebar-container"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="sidebar-card" style={{ alignItems: 'center', textAlign: 'center', height: 'auto', minHeight: 'unset', boxSizing: 'border-box', paddingBottom: 0, minHeight: 410, marginTop: '1rem', border: '2px solid #f97316', position: 'sticky', top: '2rem' }}>
                <div className="profile-header">
                    <img src={user?.profilepic} alt={user?.username} className="profile-avatar-sidebar" />
                    <h3 className="profile-name">{user?.username}</h3>
                </div>
                {showRanks && (
                <div style={{ margin: '16px 0' }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Game Ranks</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #23272f 60%, #2d1a22 100%)',
                            borderRadius: 12,
                            border: '2px solid #fa4454',
                            boxShadow: '0 0 8px 1px #fa445488',
                            width: '100%',
                            minWidth: 0,
                            height: 48,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 16px',
                        }}>
                            <span style={{ color: '#fa4454', fontWeight: 900, fontSize: 16 }}>Valorant</span>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{user.valorantRank || 'Unranked'}</span>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #23272f 60%, #2d241a 100%)',
                            borderRadius: 12,
                            border: '2px solid #f9a602',
                            boxShadow: '0 0 8px 1px #f9a60288',
                            width: '100%',
                            minWidth: 0,
                            height: 48,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 16px',
                        }}>
                            <span style={{ color: '#f9a602', fontWeight: 900, fontSize: 16 }}>BGMI</span>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{user.bgmiRank || 'Unranked'}</span>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, #23272f 60%, #1a232d 100%)',
                            borderRadius: 12,
                            border: '2px solid #00f0ff',
                            boxShadow: '0 0 8px 1px #00f0ff88',
                            width: '100%',
                            minWidth: 0,
                            height: 48,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 16px',
                        }}>
                            <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: 16 }}>COD</span>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{user.codRank || 'Unranked'}</span>
                        </div>
                    </div>
                    <div className="sidebar-chat-box" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                    {user.discord && (
                        <a href={`https://discord.com/users/${user.discord.replace(/[^\w#]/g, '')}`} target="_blank" rel="noopener noreferrer" title="Discord" style={{ color: '#5865F2', fontSize: 24 }}>
                            <FaDiscord />
                        </a>
                    )}
                    {user.twitch && (
                        <a href={`https://twitch.tv/${user.twitch}`} target="_blank" rel="noopener noreferrer" title="Twitch" style={{ color: '#9147ff', fontSize: 24 }}>
                            <FaTwitch />
                        </a>
                    )}
                    {user.youtube && (
                        <a href={user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" title="YouTube" style={{ color: '#FF0000', fontSize: 24 }}>
                            <FaYoutube />
                        </a>
                    )}
                </div>
                </div>
                )}
                
                {user && user.role === 'org' && (
                    <>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '16px 0', flexWrap: 'wrap' }}>
                            <a
                                href={user.youtube ? (user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}`) : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: user.youtube ? 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)' : '#23272f',
                                    color: user.youtube ? '#fff' : '#888',
                                    padding: '6px 14px',
                                    borderRadius: 20,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    boxShadow: user.youtube ? '0 2px 8px #ff000088' : 'none',
                                    border: user.youtube ? '1.5px solid #ff0000' : '1.5px solid #444',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    pointerEvents: user.youtube ? 'auto' : 'none',
                                    opacity: user.youtube ? 1 : 0.5,
                                    cursor: user.youtube ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <span style={{ fontSize: 18 }}>📺</span> YOUTUBE
                            </a>
                            <a
                                href={user.instagram ? `https://instagram.com/${user.instagram}` : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: user.instagram ? 'linear-gradient(135deg, #e4405f 0%, #c13584 100%)' : '#23272f',
                                    color: user.instagram ? '#fff' : '#888',
                                    padding: '6px 14px',
                                    borderRadius: 20,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    boxShadow: user.instagram ? '0 2px 8px #e4405f88' : 'none',
                                    border: user.instagram ? '1.5px solid #e4405f' : '1.5px solid #444',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    pointerEvents: user.instagram ? 'auto' : 'none',
                                    opacity: user.instagram ? 1 : 0.5,
                                    cursor: user.instagram ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <span style={{ fontSize: 18 }}>📷</span> INSTAGRAM
                            </a>
                            <a
                                href={user.website ? (user.website.startsWith('http') ? user.website : `https://${user.website}`) : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: user.website ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#23272f',
                                    color: user.website ? '#fff' : '#888',
                                    padding: '6px 14px',
                                    borderRadius: 20,
                                    fontSize: 15,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    boxShadow: user.website ? '0 2px 8px #3b82f688' : 'none',
                                    border: user.website ? '1.5px solid #3b82f6' : '1.5px solid #444',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    pointerEvents: user.website ? 'auto' : 'none',
                                    opacity: user.website ? 1 : 0.5,
                                    cursor: user.website ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s',
                                }}
                            >
                                <span style={{ fontSize: 18 }}>🌐</span> WEBSITE
                            </a>
                        </div>
                        <div style={{
                            color: '#00f0ff',
                            fontStyle: 'italic',
                            fontSize: 16,
                            textShadow: '0 0 8px #00f0ff88',
                            textAlign: 'left',
                            lineHeight: 1.6,
                            padding: '16px',
                            background: 'rgba(0,240,255,0.05)',
                            borderRadius: 12,
                            border: '1px solid rgba(0,240,255,0.2)',
                            minHeight: 60,
                            width: '100%',
                            marginTop: 8,
                            marginBottom: 8,
                        }}>
                            {user.bio || 'No description available. Click Edit Profile to add information about your organization.'}
                        </div>
                    </>
                )}
            </div>
            <style>{`
              @media (max-width: 600px) {
                .sidebar-card > *:not(.sidebar-chat-box) {
                  display: none !important;
                }
                .sidebar-card {
                  min-height: unset !important;
                  height: auto !important;
                  padding-bottom: 0 !important;
                }
              }
            `}</style>
        </motion.aside>
    );
};

export default Sidebar; 