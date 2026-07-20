import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { T, FONT_DISPLAY, FONT_BODY } from '../../constants/theme';

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: T.bg,
                padding: 20,
            }}
        >
            <Card
                style={{
                    width: 500,
                    padding: 40,
                    textAlign: 'center',
                }}
            >
                <h1
                    style={{
                        color: T.kumkum,
                        fontFamily: FONT_DISPLAY,
                        marginBottom: 20,
                    }}
                >
                    403
                </h1>

                <h2
                    style={{
                        fontFamily: FONT_DISPLAY,
                        marginBottom: 10,
                    }}
                >
                    Access Denied
                </h2>

                <p
                    style={{
                        color: T.inkSoft,
                        fontFamily: FONT_BODY,
                        marginBottom: 30,
                    }}
                >
                    You don't have permission to access this page.
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: T.primary,
                        color: '#fff',
                        fontWeight: 600,
                    }}
                >
                    Go to Dashboard
                </button>
            </Card>
        </div>
    );
}