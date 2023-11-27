import { gql, Apollo } from 'apollo-angular';
import { MediaMatcher } from '@angular/cdk/layout';

import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

const GetAllBlogPosts = gql`
  query {
    blogs {
      title
      id
    }
  }
`;

const CurrentBlogPost = gql`
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
      .watchQuery<any>({
        query: GetAllBlogPosts,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        console.log(data);
        this.blogPosts = data.blogs;

        if (this.blogPosts && this.blogPosts.length > 0) {
          this.setCurrentBlogPost(this.blogPosts[0].id);
        }
      });
  }

  setCurrentBlogPost(id: string): void {
    console.log(id);
    this.apollo
      .watchQuery<any>({
        query: CurrentBlogPost,
        variables: {
          id: id,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loadingBlog = loading;
        console.log(data);
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
