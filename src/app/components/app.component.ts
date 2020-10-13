import {gql, Apollo} from 'apollo-angular';
import { Component, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";


import { Subscription } from "rxjs";
import { MatSidenav } from '@angular/material/sidenav';

const GetAllBlogPosts = gql`
  query {
    blogs {
      title
      id
    }
  }
`;

const CurrentBlogPost = gql`
  query  blog($id:String!){
    blog(id: $id) {
      content
      meta{
        title
        id
        published
        updated
      }
    }
  }
`;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  title = "Anachrome";


  blogPosts: { title: string; id: string }[];
  blogPost: { meta: {id:string; title: string; published:Date; updated:Date}; content: string };
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
          this.setCurrentBlogPost(this.blogPosts[0].id);
        }
      });
  }

  setCurrentBlogPost(id: string): void {
    console.log(id)
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

  blogReady():void{
    this.loadingBlog =false;
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.blogSubscription.unsubscribe();
    this.blogPostSubscription.unsubscribe();
  }
}
