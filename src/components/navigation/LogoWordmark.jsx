export default function LogoWordmark() {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
            .plani { 
              fill: #FFFFFF; 
              font-family: 'Montserrat', sans-serif; 
              font-weight: 700; 
              font-size: 52px; 
              letter-spacing: 0.15rem;
            }
            .t { 
              fill: #F59E0B;
            }
            .dot { 
              fill: #F59E0B; 
            }
          `}
      </style>

      {/* White "Plani" */}
      <text x="10" y="50" className="plani">
        Plani
      </text>

      {/* Saffron Gold "T" */}
      <text x="157" y="50" className="plani t">
        T
      </text>

      {/* Saffron Gold dot on "i" */}
      <circle cx="149.2" cy="13" r="5" className="dot" />
    </svg>
  );
}
