import "./Newsletter.css";

export default function Newsletter() {
  return (
    <div id="newsletter">
      <div className="newsletter">
        <img src="https://lrhddyosfvnhpxojsjpa.supabase.co/storage/v1/object/public/images/logos/cg_digestive.png" alt="Cheese Grater Digestive" />

        <div className="text">
          <h3 className="header">Newsletter: The Digestive</h3>

          <p>Keep up with what’s happening at UCL with our newsletter, the Digestive, your roundup of campus news, satire, and student discourse delivered to your inbox every other Monday during term time.</p>

          <a href="https://us17.campaign-archive.com/home/?u=65bd5c7a770205040fd2e9e8a&id=9679db51c3" target="_blank"><button><h3 className="button-h3">Join our newsletter</h3></button></a>

        </div>
      </div>
    </div>
  );
}
