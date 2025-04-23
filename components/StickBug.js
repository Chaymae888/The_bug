import React, { useEffect } from 'react';
import styles from './StickBug.module.css';

const StickBug = () => {
  useEffect(() => {
    const stickbugs = document.getElementsByClassName(styles.stickbug);
    
    for (let i = 0; i < stickbugs.length; i++) {
      const stickbug = stickbugs[i];
      
      randomPositionStickbug(stickbug);
      
      stickbug.speed = 20;
      stickbug.angle = Math.random() * Math.PI * 2;
      
      stickbug.dx = -Math.cos(stickbug.angle) * stickbug.speed;
      stickbug.dy = -Math.sin(stickbug.angle) * stickbug.speed;
      
      stickbug.style.transform = `rotate(${Math.random() * 360}deg)`;
    }

    function randomPositionStickbug(stickbug) {
      const maxX = window.innerWidth - stickbug.offsetWidth;
      const maxY = window.innerHeight - stickbug.offsetHeight;
      
      stickbug.x = Math.random() * maxX;
      stickbug.y = Math.random() * maxY;
      
      stickbug.style.left = `${stickbug.x}px`;
      stickbug.style.top = `${stickbug.y}px`;
    }

    function animate() {
      for (let i = 0; i < stickbugs.length; i++) {
        const stickbug = stickbugs[i];
        
        stickbug.x += -stickbug.dx / 60;
        stickbug.y += -stickbug.dy / 60;
        
        if (stickbug.x <= 0 || stickbug.x >= window.innerWidth - stickbug.offsetWidth) {
          stickbug.dx *= -1;
        }
        if (stickbug.y <= 0 || stickbug.y >= window.innerHeight - stickbug.offsetHeight) {
          stickbug.dy *= -1;
        }
        
        stickbug.style.left = `${stickbug.x}px`;
        stickbug.style.top = `${stickbug.y}px`;
        
        const rotation = Math.atan2(stickbug.dy, stickbug.dx) * (180/Math.PI) - 90;
        stickbug.style.transform = `scale(0.3) rotate(${rotation}deg)`;
      }
      
      requestAnimationFrame(animate);
    }
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
         <span className={styles.stickbug}>
      <div className={styles.head}>
        <div className={styles.antenna}></div>
      </div>
    
      <div className={styles.body}></div>
    
      <div className={styles.legs}>
        <div className={styles.top}>
          <div className={styles.left}>
            <span></span>
            <span></span>
          </div>
          <div className={styles.right}>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={styles.mid}>
          <div className={styles.left}>
            <span></span>
            <span></span>
          </div>
          <div className={styles.right}>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={styles.bot}>
          <div className={styles.left}>
            <span></span>
            <span></span>
          </div>
          <div className={styles.right}>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </span>
   
  );
};

export default StickBug;