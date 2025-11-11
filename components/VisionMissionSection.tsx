import React from 'react';

const VisionMissionSection: React.FC = () => {
    return (
        <section id="vision" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        رؤيتنا ورسالتنا
                    </h2>
                </div>

                <div className="space-y-12">
                    {/* رسالتنا */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">📜</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-4">رسالتنا</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    بعد <span className="text-blue-400 font-semibold">التوكل على الله</span>، لا يوجد شيء مستحيل. نؤمن أن كل فكرة — مهما كانت بسيطة — يمكن أن تتحول إلى واقع بإذن الله عندما تمتزج بالإرادة، الإيمان، والمعرفة.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* رؤيتنا */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🎯</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-4">رؤيتنا</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    أن نصنع مجتمعًا معرفيًا متكاملًا يضم كل من يسعى للتعلم والتطور في مجال الذكاء الاصطناعي، في الكويت، والخليج، والعالم العربي والإسلامي، ولجميع طلاب العلم في العالم، لأننا نؤمن أن العلم رسالة إنسانية لا تعرف حدودًا.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* هدفنا */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-green-500/50 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">🎓</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-4">هدفنا</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    نهدف إلى تمكين الجميع من تعلم الذكاء الاصطناعي وتطبيقه في حياتهم العملية والمهنية. نوفر محتوى تعليميًا ميسرًا، ودورات احترافية، وفرص تواصل مع مستشارين وخبراء في مجال الذكاء الاصطناعي، لمساعدة كل شخص على تحويل فكرته إلى إنجاز واقعي يسهم في بناء مستقبل أفضل.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* رسالتنا لك */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">💡</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-4">رسالتنا لك</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">
                                    ابدأ اليوم، وتذكّر أن <span className="text-blue-400 font-semibold">بعد التوكل على الله لا يوجد شيء مستحيل</span>. كل ما تحتاجه هو أن تؤمن بنفسك، وتسعى بخطوات ثابتة نحو حلمك، ونحن معك في رحلتك نحو التميّز والإبداع.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative element */}
                <div className="mt-12 text-center">
                    <div className="inline-block">
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VisionMissionSection;
