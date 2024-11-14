use actix_web::{web, App, HttpServer, HttpResponse, Result};
use actix_files::Files;
use tera::{Tera, Context};
use lazy_static::lazy_static;

lazy_static! {
    pub static ref TEMPLATES: Tera = {
        let mut tera = match Tera::new("templates/**/*") {
            Ok(t) => t,
            Err(e) => {
                println!("Parsing error(s): {}", e);
                ::std::process::exit(1);
            }
        };
        tera
    };
}

// Handler für die Startseite
async fn index() -> Result<HttpResponse> {
    let mut context = Context::new();
    context.insert("page_title", "Marek Krug");

    let rendered = TEMPLATES.render("index.html", &context)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Template error"))?;

    Ok(HttpResponse::Ok().content_type("text/html").body(rendered))
}

// Handler für die Projektseite
async fn projects() -> Result<HttpResponse> {
    let mut context = Context::new();
    context.insert("page_title", "Projekte - Marek Krug");

    let rendered = TEMPLATES.render("projects.html", &context)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Template error"))?;

    Ok(HttpResponse::Ok().content_type("text/html").body(rendered))
}

// Handler für die About-Seite
async fn about() -> Result<HttpResponse> {
    let mut context = Context::new();
    context.insert("page_title", "Über mich - Marek Krug");

    let rendered = TEMPLATES.render("about.html", &context)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Template error"))?;

    Ok(HttpResponse::Ok().content_type("text/html").body(rendered))
}

// Handler für die Kontakt-Seite
async fn contact() -> Result<HttpResponse> {
    let mut context = Context::new();
    context.insert("page_title", "Kontakt - Marek Krug");

    // Wenn du noch keine contact.html hast, musst du diese noch erstellen
    let rendered = TEMPLATES.render("contact.html", &context)
        .map_err(|_| actix_web::error::ErrorInternalServerError("Template error"))?;

    Ok(HttpResponse::Ok().content_type("text/html").body(rendered))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server starting at http://127.0.0.1:8080");

    HttpServer::new(|| {
        App::new()
            .service(Files::new("/static", "static").show_files_listing())
            .route("/", web::get().to(index))
            .route("/projects", web::get().to(projects))
            .route("/about", web::get().to(about))
            .route("/contact", web::get().to(contact))
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}