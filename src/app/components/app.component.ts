import { gql, Apollo } from 'apollo-angular';
import { MediaMatcher } from '@angular/cdk/layout';

import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


type BlogsResult = {
  blogs: {
    id:string,
    title:string,
    isActive:boolean,
  }[]
}

const GetAllBlogPosts = gql<BlogsResult,any>`
  query {
    blogs {
      title
      id
    }
  }
`;
type BlogPostResult = {
  blog: {
    content:string,
    meta:{
      id:string,
      title:string,
      published:Date,
      updated:Date,
    }
  }
}
type BlogPostArgs = {
  id:string
}
const BlogPostQuery = gql<BlogPostResult,BlogPostArgs>`
  query blog($id: String!) {
    blog(id: $id) {
      content
      meta {
        title
        id
        published
        updated
      }
    }
  }
`;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav?: MatSidenav;
  title = 'nachrome';

  blogPosts: { title: string; id: string; isActive: boolean }[] = [];
  blogPost?: {
    meta: { id: string; title: string; published: Date; updated: Date };
    content: string;
  };
  mobileQuery: MediaQueryList;
  mobileQueryListener: () => void;
  blogSubscription: Subscription = new Subscription();
  loading: boolean = false;
  blogPostSubscription: Subscription = new Subscription();
  loadingBlog: boolean = false;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private apollo: Apollo,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.blogSubscription = this.apollo
      .watchQuery({
        query: GetAllBlogPosts,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        this.blogPosts = data.blogs;

        if (this.blogPosts && this.blogPosts.length > 0) {
          this.setCurrentBlogPost(this.blogPosts[0].id);
        }
      });
  }

  setCurrentBlogPost(id: string): void {
    this.apollo
      .watchQuery({
        query: BlogPostQuery,
        variables: {
          id: id,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loadingBlog = loading;
        this.blogPost = data.blog;
      });
  }

  blogReady(): void {
    this.loadingBlog = false;
  }
  ngOnDestroy(): void {
    // this.mobileQuery.removeListener(this._mobileQueryListener);

    this.blogSubscription.unsubscribe();
    this.blogPostSubscription.unsubscribe();
  }
}
