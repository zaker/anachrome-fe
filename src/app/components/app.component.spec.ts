import { provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { provideMarkdown } from "ngx-markdown";
import { Subject } from "rxjs";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  it("renders asynchronously loaded posts and the selected post in zoneless mode", async () => {
    const blogs = new Subject<{
      dataState: "complete";
      loading: boolean;
      data: { blogs: { id: string; title: string }[] };
    }>();
    const post = new Subject<{
      dataState: "complete";
      loading: boolean;
      data: { blog: { content: string; meta: { id: string; title: string } } };
    }>();
    const apollo = {
      watchQuery: jasmine.createSpy().and.returnValues(
        { valueChanges: blogs },
        { valueChanges: post },
      ),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMarkdown(),
        { provide: Apollo, useValue: apollo },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();

    blogs.next({
      dataState: "complete",
      loading: false,
      data: { blogs: [{ id: "first", title: "First post" }] },
    });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector("mat-nav-list").textContent).toContain("FIRST POST");

    post.next({
      dataState: "complete",
      loading: false,
      data: { blog: { content: "Initial **content**", meta: { id: "first", title: "First post" } } },
    });
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector(".app-content h1").textContent).toContain("FIRST POST");
    expect(fixture.nativeElement.querySelector("markdown strong").textContent).toBe("content");
  });
});
