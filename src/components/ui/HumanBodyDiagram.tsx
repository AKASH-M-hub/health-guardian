import { motion } from 'framer-motion';

interface AffectedArea {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
}

interface HumanBodyDiagramProps {
  affectedAreas?: AffectedArea[];
  className?: string;
}

export function HumanBodyDiagram({ affectedAreas = [], className = '' }: HumanBodyDiagramProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'fill-destructive';
      case 'medium': return 'fill-warning';
      case 'low': return 'fill-success';
      default: return 'fill-muted';
    }
  };

  const isAffected = (areaId: string) => {
    return affectedAreas.find(a => a.id === areaId);
  };

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 400" className="w-full h-full max-w-[200px] mx-auto">
        {/* Head */}
        <motion.ellipse
          cx="100" cy="35" rx="25" ry="30"
          className={`${isAffected('head') ? getSeverityColor(isAffected('head')!.severity) : 'fill-primary/20'} stroke-primary stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        />
        
        {/* Neck */}
        <motion.rect
          x="90" y="60" width="20" height="20"
          className={`${isAffected('neck') ? getSeverityColor(isAffected('neck')!.severity) : 'fill-primary/20'} stroke-primary stroke-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        />
        
        {/* Chest/Heart */}
        <motion.ellipse
          cx="100" cy="120" rx="40" ry="35"
          className={`${isAffected('heart') || isAffected('chest') ? getSeverityColor((isAffected('heart') || isAffected('chest'))!.severity) : 'fill-primary/20'} stroke-primary stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        
        {/* Lungs Left */}
        <motion.ellipse
          cx="70" cy="110" rx="15" ry="25"
          className={`${isAffected('lungs') ? getSeverityColor(isAffected('lungs')!.severity) : 'fill-ocean/30'} stroke-ocean stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        />
        
        {/* Lungs Right */}
        <motion.ellipse
          cx="130" cy="110" rx="15" ry="25"
          className={`${isAffected('lungs') ? getSeverityColor(isAffected('lungs')!.severity) : 'fill-ocean/30'} stroke-ocean stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        />
        
        {/* Stomach/Abdomen */}
        <motion.ellipse
          cx="100" cy="175" rx="35" ry="30"
          className={`${isAffected('stomach') || isAffected('abdomen') ? getSeverityColor((isAffected('stomach') || isAffected('abdomen'))!.severity) : 'fill-mint/30'} stroke-mint-dark stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        
        {/* Liver */}
        <motion.ellipse
          cx="125" cy="160" rx="18" ry="15"
          className={`${isAffected('liver') ? getSeverityColor(isAffected('liver')!.severity) : 'fill-coral/30'} stroke-coral stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        />
        
        {/* Kidneys */}
        <motion.ellipse
          cx="75" cy="190" rx="10" ry="15"
          className={`${isAffected('kidneys') ? getSeverityColor(isAffected('kidneys')!.severity) : 'fill-lavender/30'} stroke-lavender-dark stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.ellipse
          cx="125" cy="190" rx="10" ry="15"
          className={`${isAffected('kidneys') ? getSeverityColor(isAffected('kidneys')!.severity) : 'fill-lavender/30'} stroke-lavender-dark stroke-2 cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        
        {/* Hips */}
        <motion.path
          d="M 65 210 Q 100 240 135 210"
          className={`${isAffected('hips') ? getSeverityColor(isAffected('hips')!.severity) : 'fill-primary/20'} stroke-primary stroke-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        />
        
        {/* Left Arm */}
        <motion.path
          d="M 60 85 L 35 150 L 25 200"
          className="fill-none stroke-primary stroke-[12] stroke-linecap-round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        
        {/* Right Arm */}
        <motion.path
          d="M 140 85 L 165 150 L 175 200"
          className="fill-none stroke-primary stroke-[12] stroke-linecap-round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        
        {/* Left Leg */}
        <motion.path
          d="M 85 220 L 75 300 L 70 380"
          className={`fill-none ${isAffected('legs') ? 'stroke-destructive' : 'stroke-primary'} stroke-[14] stroke-linecap-round`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
        
        {/* Right Leg */}
        <motion.path
          d="M 115 220 L 125 300 L 130 380"
          className={`fill-none ${isAffected('legs') ? 'stroke-destructive' : 'stroke-primary'} stroke-[14] stroke-linecap-round`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
        
        {/* Brain indicator */}
        {isAffected('brain') && (
          <motion.circle
            cx="100" cy="30" r="8"
            className={`${getSeverityColor(isAffected('brain')!.severity)}`}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </svg>
      
      {/* Legend */}
      {affectedAreas.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {affectedAreas.map((area) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                area.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                area.severity === 'medium' ? 'bg-warning/20 text-warning' :
                'bg-success/20 text-success'
              }`}
            >
              {area.name}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
