import {gql, Apollo} from 'apollo-angular';
import { Component, ChangeDetectorRef, OnDestroy, OnInit } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";


import { Subscription } from "rxjs";

const GetAllBlogPosts = gql`
  query {
    blogs {
      title
      path
    }
  }
`;

const CurrentBlogPost = gql`
  query  blog($path:String!){
    blog(path: $path) {
      title
      content
    }
  }
`;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Anachrome";

  blogPosts: { title: string; path: string }[];
  blogPost: { title: string; content: string };
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  blogSubscription: Subscription;
  loading: boolean;
  blogPostSubscription: Subscription;
  loadingBlog  :boolean;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private apollo: Apollo
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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
          this.setCurrentBlogPost(this.blogPosts[0].path);
        }
      });
  }

  setCurrentBlogPost(path: string): void {
    console.log(path)
    this.apollo
      .watchQuery<any>({
        query: CurrentBlogPost,
        variables: {
          path: path,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loadingBlog = loading;
        console.log(data);
        this.blogPost = data.blog;
      });
  }

  blogReady():void{
    this.loadingBlog =false;
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.blogSubscription.unsubscribe();
    this.blogPostSubscription.unsubscribe();
  }
}
