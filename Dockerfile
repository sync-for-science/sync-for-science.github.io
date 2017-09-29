FROM jekyll/minimal
MAINTAINER Michael McDuffie

COPY . /srv/jekyll

WORKDIR /srv/jekyll

CMD jekyll build && jekyll serve