import { http, HttpResponse } from 'msw'

// URL de base utilisée par Axios dans ton projet
const API_URL = 'http://localhost:8000/api'

/**
 * Handlers MSW (Mock Service Worker)
 * Simule le backend Symfony / API Platform pendant les tests
 */
export const handlers = [

    /**
     * GET /contenus
     * ➤ Handler indispensable pour MovieListView.vue
     * ➤ Simule la réponse d'API Platform
     */
    http.get(`${API_URL}/contenus`, () => {
        return HttpResponse.json({
            "@context": "/api/contexts/Contenu",
            "@id": "/api/contenus",
            "@type": "Collection",
            totalItems: 0,
            member: [] // vide pour test
        })
    }),


    /**
     * POST /login_check
     * Simule la connexion utilisateur
     */
    http.post(`${API_URL}/login_check`, async ({ request }) => {
        const body = await request.json()

        if (body.email === 'admin@example.com' && body.password === 'admin123') {
            return HttpResponse.json({
                token: 'fake-admin-token',
                refresh_token: 'fake-admin-refresh'
            })
        }

        return HttpResponse.json(
            { message: 'Invalid credentials' },
            { status: 401 }
        )
    }),


    /**
     * POST /register
     * Simule la création d’un utilisateur
     */
    http.post(`${API_URL}/register`, async ({ request }) => {
        const body = await request.json()

        if (body.email === 'existing@example.com') {
            return HttpResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            )
        }

        return HttpResponse.json(
            { message: 'User created' },
            { status: 201 }
        )
    }),


    /**
     * POST /token/refresh
     */
    http.post(`${API_URL}/token/refresh`, async ({ request }) => {
        const body = await request.json()

        if (body.refresh_token === 'fake-refresh-token') {
            return HttpResponse.json({
                token: 'new-fake-access',
                refresh_token: 'new-fake-refresh'
            })
        }

        return HttpResponse.json(
            { message: 'Invalid refresh token' },
            { status: 401 }
        )
    }),


    /**
     * GET /users/:id
     */
    http.get(`${API_URL}/users/:id`, ({ params }) => {
        return HttpResponse.json({
            id: parseInt(params.id),
            email: 'user@example.com',
            roles: ['ROLE_USER'],
            movies: []
        })
    }),


    /**
     * PATCH /users/:id
     */
    http.patch(`${API_URL}/users/:id`, async ({ request, params }) => {
        const authHeader = request.headers.get('Authorization')

        if (!authHeader) {
            return HttpResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        return HttpResponse.json({
            id: parseInt(params.id),
            email: 'user@example.com',
            roles: ['ROLE_USER'],
            movies: ['/api/movies/1']
        })
    }),


    /**
     * GET /movies
     */
    http.get(`${API_URL}/movies`, ({ request }) => {
        const url = new URL(request.url)
        const type = url.searchParams.get('type')
        const title = url.searchParams.get('title')

        let movies = [
            {
                id: 1,
                title: 'Inception',
                description: 'A thief who steals corporate secrets',
                duration: 148,
                type: 'movie',
                releaseDate: '2010-07-16T00:00:00+00:00',
                posterUrl: '/uploads/inception.jpg',
                genres: [{ id: 1, name: 'Sci-Fi' }]
            },
            {
                id: 2,
                title: 'Breaking Bad',
                description: 'A chemistry teacher turned meth manufacturer',
                duration: 47,
                type: 'series',
                releaseDate: '2008-01-20T00:00:00+00:00',
                posterUrl: '/uploads/breaking-bad.jpg',
                genres: [{ id: 2, name: 'Drama' }]
            }
        ]

        if (type)
            movies = movies.filter(m => m.type === type)

        if (title)
            movies = movies.filter(m =>
                m.title.toLowerCase().includes(title.toLowerCase())
            )

        return HttpResponse.json({ member: movies })
    }),


    /**
     * GET /movies/:id
     */
    http.get(`${API_URL}/movies/:id`, ({ params }) => {
        const movies = {
            1: {
                id: 1,
                title: 'Inception',
                description: 'A thief who steals corporate secrets',
                duration: 148,
                type: 'movie',
                releaseDate: '2010-07-16T00:00:00+00:00',
                posterUrl: '/uploads/inception.jpg',
                trailer: 'https://youtube.com/watch?v=test',
                genres: [{ id: 1, name: 'Sci-Fi' }]
            }
        }

        const movie = movies[params.id]

        if (!movie) {
            return HttpResponse.json(
                { message: 'Movie not found' },
                { status: 404 }
            )
        }

        return HttpResponse.json(movie)
    }),


    /**
     * POST /movies
     */
    http.post(`${API_URL}/movies`, async ({ request }) => {
        const authHeader = request.headers.get('Authorization')

        if (!authHeader) {
            return HttpResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        return HttpResponse.json({
            id: 3,
            title: 'New Movie',
            description: 'Test description',
            duration: 120,
            type: 'movie',
            releaseDate: '2024-01-01T00:00:00+00:00',
            posterUrl: null,
            genres: []
        }, { status: 201 })
    }),


    /**
     * PUT /movies/:id
     */
    http.put(`${API_URL}/movies/:id`, async ({ params, request }) => {
        const authHeader = request.headers.get('Authorization')

        if (!authHeader) {
            return HttpResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        return HttpResponse.json({
            id: parseInt(params.id),
            title: 'Updated Movie',
            description: 'Updated description',
            duration: 150,
            type: 'movie',
            releaseDate: '2024-06-01T00:00:00+00:00',
            posterUrl: null,
            genres: []
        })
    }),


    /**
     * DELETE /movies/:id
     */
    http.delete(`${API_URL}/movies/:id`, ({ request }) => {
        const authHeader = request.headers.get('Authorization')

        if (!authHeader) {
            return HttpResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        return new HttpResponse(null, { status: 204 })
    }),


    /**
     * GET /genres
     */
    http.get(`${API_URL}/genres`, () => {
        return HttpResponse.json({
            member: [
                { id: 1, name: 'Action' },
                { id: 2, name: 'Sci-Fi' },
                { id: 3, name: 'Drama' }
            ]
        })
    }),


    /**
     * OPTIONS * (CORS fallback)
     */
    http.options('*', () => {
        return new HttpResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization'
            }
        })
    })
]
