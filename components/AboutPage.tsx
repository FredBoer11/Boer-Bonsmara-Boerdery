import React from 'react';
import { Award, Dna, BarChart3, TrendingUp, DollarSign, ShieldCheck, Leaf } from 'lucide-react';

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center gap-4 mb-3">
      <div className="bg-brand-tan p-3 rounded-full text-brand-brown">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-serif text-brand-green">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
      <div className="text-center border-b-2 border-brand-tan pb-6">
        <h1 className="text-4xl font-bold font-serif text-brand-green tracking-tight">The Bonsmara Advantage</h1>
        <p className="mt-3 text-lg text-brand-brown max-w-2xl mx-auto">
          An investor's guide to the profitable and sustainable world of Bonsmara stud farming.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <InfoCard icon={<Award size={24} />} title="What is a Bonsmara?">
          Developed in South Africa, the Bonsmara is a scientifically bred "beefbreed of the future." It is renowned for its exceptional adaptability to harsh climates, high fertility, calm temperament, and superior beef quality, making it a low-maintenance, high-performance asset.
        </InfoCard>
        <InfoCard icon={<Dna size={24} />} title="The Business of Genetics">
          Stud farming is fundamentally different from commercial farming. Instead of producing beef for consumption, a stud farm produces high-value genetics. The core products are elite bulls and heifers sold to other farmers to improve the quality and profitability of their own herds.
        </InfoCard>
      </div>

      <div>
        <h2 className="text-3xl font-bold font-serif text-brand-green text-center mb-6">A Profitable & Sustainable Model</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <DollarSign className="mx-auto h-10 w-10 text-brand-green mb-3"/>
                <h4 className="font-semibold text-lg text-brand-brown">Multiple Revenue Streams</h4>
                <p className="text-sm text-gray-500 mt-1">Income is generated from premium-priced stud bulls and heifers, surplus commercial weaners, and older cull cows.</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <TrendingUp className="mx-auto h-10 w-10 text-brand-green mb-3"/>
                <h4 className="font-semibold text-lg text-brand-brown">Compounding Growth</h4>
                <p className="text-sm text-gray-500 mt-1">The herd is a living, appreciating asset. Each year it produces more animals, compounding the initial investment naturally.</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-brand-green mb-3"/>
                <h4 className="font-semibold text-lg text-brand-brown">Data-Driven Decisions</h4>
                <p className="text-sm text-gray-500 mt-1">Modern stud breeding is a science, using performance data to make precise genetic decisions and maximize herd value.</p>
            </div>
        </div>
      </div>
      
       <div>
        <h2 className="text-3xl font-bold font-serif text-brand-green text-center mb-6">Why It's a Solid Investment</h2>
        <div className="space-y-4">
           <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <ShieldCheck className="h-8 w-8 text-brand-green flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-lg text-brand-brown">Resilience & Demand</h4>
                    <p className="text-gray-600">Agriculture is a resilient, non-negotiable sector. The global demand for high-quality, sustainably produced protein is consistently rising, ensuring a stable market for superior genetics.</p>
                </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Leaf className="h-8 w-8 text-brand-green flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-lg text-brand-brown">Tangible & Sustainable Asset</h4>
                    <p className="text-gray-600">This is an investment in tangible assets: land and livestock. The Bonsmara's adaptability makes it ideal for eco-friendly farming, thriving on natural veld with minimal inputs and aligning with modern conservation values.</p>
                </div>
            </div>
        </div>
      </div>

    </main>
  );
};

export default AboutPage;
