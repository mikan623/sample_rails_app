Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000', # Next.jsの開発サーバー
           'https://your-frontend-domain.vercel.app', # Vercel
           'https://your-frontend-domain.netlify.app'  # Netlify

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end 