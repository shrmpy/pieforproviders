ARG ARCH=

# pie requires ruby 2.6.6 and node 12.14.1
FROM ${ARCH}ruby:2.6.6-buster

RUN apt-get update -qq && apt-get install -y postgresql-client
WORKDIR /app/backend
COPY .env.sample /app/backend/.env

# install bundle
RUN gem install bundler 
COPY Gemfile /app/backend/Gemfile
COPY Gemfile.lock /app/backend/Gemfile.lock
RUN bundle install
COPY . /app/backend


# Add a script to be executed every time the container starts.
COPY build/entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
EXPOSE 3001

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3001"]
